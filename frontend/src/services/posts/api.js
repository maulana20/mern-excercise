import request from '../request';

export async function getPosts() {
  return await request.get('/posts');
}
