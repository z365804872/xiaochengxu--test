import getApi from './get';
import postApi from './post';
const get = "GET";
const post = "POST";

Object.keys(getApi).forEach(api =>{
  if(typeof getApi[api] === 'object'){
    getApi[api].method = get
  }
})

Object.keys(postApi).forEach(api =>{
  if(typeof postApi[api] === 'object'){
    postApi[api].method = post
  }
})

export default {
  ...getApi,
  ...postApi
}