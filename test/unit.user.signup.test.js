const { signup } = require('../controllers/usersCtrl');
const Users = require('../repository/users');

jest.mock('../repository/users');

describe('Unit test ', () => {
  const req = { body: {} };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();
  it('user exist', async () => {
    const user = { email: {} };
    Users.findByEmail = jest.fn(() => {
      return user;
    });

    const result = await signup(req, res, next);
    expect(result.message).toEqual('Email in use');
  });
  it('user not exist', async () => {
    Users.signup = jest.fn();
    const result = await signup(req, res, next);
    expect(result.message).toEqual('missing fields');
  });
  it('user exist and add sub', async () => {
    Users.signup = jest.fn();
    const result = await signup(req, res, next);
    expect(result.message).toEqual('missing fields');
  });
  it('user exist: error', async () => {
    Users.signup = jest.fn(() => {
      throw new Error('Ooops');
    });
    await signup(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
