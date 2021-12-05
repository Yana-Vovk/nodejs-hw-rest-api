const fs = require('fs/promises').promises;
const path = require('path');
const Jimp = require('jimp');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../repository/users');
const { HttpCode } = require('../helper/const');

const createFolder = require('../helper/create-folder');
//const UploadAvatarService = require('../services/local-upload')
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await Users.findByEmail(email);

    if (user) {
      return res
        .status(HttpCode.CONFLICT)
        .type('application/json')
        .json({ message: 'Email in use' });
    }

    const newUser = await Users.createUser(req.body);
    if (!newUser) {
      return res
        .status(HttpCode.BAD_REQEST)
        .type('application/json')
        .json({ message: 'missing required field' });
    }

    return res
      .status(HttpCode.CREATED)
      .type('application/json')
      .json({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatar: newUser.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .type('application/json')
        .json({ message: 'Email or password is wrong' });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7 days' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).type('application/json').json({ token });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const userId = req.user.id;
  const user = await Users.findUserById(userId);

  if (!user) {
    return res
      .status(HttpCode.UNAUTHORIZED)
      .type('application/json')
      .json({ message: 'Not authorized' });
  }

  await Users.updateToken(userId, null);

  return res.status(HttpCode.NO_CONTENT).json({});
};

const checkUserByToken = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .type('application/json')
        .json({ message: 'Not authorized' });
    }

    return res
      .status(HttpCode.OK)
      .type('application/json')
      .json({ user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    console.log(error);
  }
};

const updateUserSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    const id = user.id;
    const subscription = req.body.subscription;
    const newSubscription = await Users.updateUserSubscription(
      id,
      subscription
    );
    const updatedSubscritrion = newSubscription.subscription;

    if (!newSubscription) {
      return res
        .status(HttpCode.BAD_REQEST)
        .json({ message: 'Server could not update your subscription' });
    }
    return res
      .status(HttpCode.OK)
      .json({ user: { email: user.email, subscription: updatedSubscritrion } });
  } catch (error) {
    console.log(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    //const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS)
    const avatarUrl = await saveAvatarToStatic(req);

    await Users.updateAvatar(id, avatarUrl);

    if (!req.user) {
      return res
        .status(HttpCode.UNAUTHORIZED)
        .type('application/json')
        .json({ message: 'Not authorized' });
    }
    return res.status(HttpCode.OK).type('application/json').json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};
const saveAvatarToStatic = async (req, res, next) => {
  const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const image = await Jimp.read(pathFile);
  await image
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolder(path.join(AVATAR_OF_USERS, 'images'));
  await fs.rename(
    pathFile,
    path.join(AVATAR_OF_USERS, 'images', newNameAvatar)
  );
  const avatarUrl = path.normalize(path.join(newNameAvatar));
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATAR_OF_USERS, 'images', req.user.avatar)
    );
  } catch (error) {
    console.log(error.message);
  }
  return avatarUrl;
};

module.exports = {
  signup,
  login,
  logout,
  checkUserByToken,
  updateUserSubscription,
  avatars,
};
