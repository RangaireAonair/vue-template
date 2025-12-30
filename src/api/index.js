import { get, post } from '@/request/request.js';

export function getPage(params) {
  return get(`/posts`, params, {
    cache: true
    // meta: {
    //   validator: { code: 1 },
    //   transform: ({ raw }) => {
    //     return raw.filter(({ userId }) => userId === 1);
    //   }
    // }
  });
}
export function getPost(params) {
  return get(`/posts`, params, { cache: false });
}

export function postPage(params) {
  return post('/submit/work', params);
}
