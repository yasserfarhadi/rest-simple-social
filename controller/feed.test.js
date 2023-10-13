import { jest } from '@jest/globals';
import User from '../models/user.js';
import { createPost } from './feed.js';
import Post from '../models/post.js';
describe('create post controller', () => {
  test('should add a created post to the posts of the creator', async () => {
    const user = {
      save: jest.fn(() => {}),
      posts: { push: jest.fn() },
      _id: 'abc',
      name: 'bbk',
    };
    const req = {
      userId: 'abc',
      file: {
        path: 'somewhere else',
      },
      body: {
        title: 'title',
        content: 'content',
      },
    };
    jest.spyOn(User, 'findById').mockReturnValueOnce(user);
    // const post = new Post()
    const postSave = jest
      .spyOn(Post.prototype, 'save')
      .mockImplementationOnce(() => {
        console.log('post saved');
      });
    const res = {
      status: jest.fn(() => {
        return res;
      }),
      json: jest.fn(),
    };

    const nextFn = jest.fn();

    await createPost(req, res, nextFn);

    expect(postSave).toBeCalledTimes(1);
    expect(user.posts.push).toBeCalledTimes(1);
    expect(user.posts.push).toBeCalledWith(
      expect.objectContaining({ ...req.body, imageUrl: req.file.path })
    );
    expect(user.save).toBeCalledTimes(1);
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith(
      expect.objectContaining({
        message: 'Post created successfully!',
        post: expect.objectContaining({ ...req.body, imageUrl: req.file.path }),
        creator: { _id: user._id, name: user.name },
      })
    );
  });
});
