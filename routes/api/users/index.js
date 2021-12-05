const express = require('express');
const router = express.Router();
const ctrl = require('../../../controllers/usersCtrl');
const guard = require('../../../helper/guard');
const { userRegLimiter } = require('../../../helper/reg-limit');
const upload = require('../../../helper/udload');

router.post('/signup', userRegLimiter, ctrl.signup);
router.post('/login', ctrl.login);
router.post('/logout', guard, ctrl.logout);

router.get('/current', guard, ctrl.checkUserByToken);

router.patch('/', guard, ctrl.updateUserSubscription);

router.patch('/avatars', guard, upload.single('avatar'), ctrl.avatars);

module.exports = router;
