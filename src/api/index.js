import { get, post } from '@/request';

export function getPage() {
  return get('/getPage', { page: 1 });
}

export function postPage(params) {
  return post('/submit/work', params);
}
