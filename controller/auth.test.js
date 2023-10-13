import { jest } from '@jest/globals';
import User from '../models/user.js';
import { login, getUserStatus } from './auth.js';

describe('login() auth controller', () => {
  test('should throw an error with code 500 if accessing the database failed', async () => {
    jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
      throw new Error('Connection Error');
    });
    const req = { body: { email: 'test@test.com', password: '123123' } };
    const nextFn = jest.fn();

    await login(req, {}, nextFn);

    expect(nextFn).toBeCalledTimes(1);
    expect(nextFn).toBeCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Connection Error',
      })
    );
  });
});

describe('getUserStatus', () => {
  test('should send a response with a valid user status for an existing user', async () => {
    jest.spyOn(User, 'findById').mockImplementationOnce(() => {
      return {
        status: 'I am new!',
      };
    });
    const req = { userId: 'abc' };
    const res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn(),
    };

    await getUserStatus(req, res, jest.fn());

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({ status: 'I am new!' });
  });
});
