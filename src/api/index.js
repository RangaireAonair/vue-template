import { get, post } from '@/request';

export function getPage(params) {
  console.log(params);
  return get(`/posts`, params, { cache: true });
}
export function getPost(params) {
  return get(`/posts`, params, { cache: false });
}

export function postPage(params) {
  return post('/submit/work', params);
}
