import { jest } from '@jest/globals';
import isAuth from './isAuth';
import jwt from 'jsonwebtoken';

describe('isAuth()', () => {
  test('should throw an error if no authorization header is present', () => {
    const req = {
      get: jest.fn(),
    };

    const isAuthFn = () => isAuth(req, {}, jest.fn());
    expect(isAuthFn).toThrow('Not authenticated');
    expect(req.get).toBeCalledTimes(1);
    expect(req.get).toBeCalledWith('Authorization');
  });

  test('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: jest.fn(() => 'zxc'),
    };

    expect(isAuth.bind(null, req, {}, jest.fn())).toThrow();
  });

  test('should throw an error when malformed token porivided', () => {
    const req = {
      get: jest.fn(() => 'Bearer sd'),
    };

    expect(isAuth.bind(null, req, {}, jest.fn())).toThrow('jwt malformed');
  });

  test('should yield a userId on req object after providing a correct token', () => {
    jest
      .spyOn(jwt, 'verify')
      .mockImplementationOnce(() => ({ userId: 'userIdToken' }));
    const req = {
      get: jest.fn(() => 'Bearer sd'),
    };
    const nextFn = jest.fn();

    isAuth(req, {}, nextFn);

    expect(req.userId).toBe('userIdToken');
    expect(nextFn).toBeCalledTimes(1);
  });
});
