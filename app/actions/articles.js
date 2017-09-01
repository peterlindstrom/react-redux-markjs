import { CALL_API, CHAIN_API } from 'middleware/api'

export const LOADED_ARTICLES = Symbol('LOADED_ARTICLES')
export function loadArticles() {
  return {
    [CALL_API]: {
      method: 'get',
      path: '/api/articles',
      successType: LOADED_ARTICLES
    }
  }
}

export const LOADED_ARTICLE_DETAIL = Symbol('LOADED_ARTICLE_DETAIL')
export const LOADED_ARTICLE_USER = Symbol('LOADED_ARTICLE_USER')
export function loadArticleDetail ({ id, history }) {
  return {
    [CHAIN_API]: [
      ()=> {
        return {
          [CALL_API]: {
            method: 'get',
            path: `/api/articles/${id}`,
            successType: LOADED_ARTICLE_DETAIL,
            afterError: ()=> {
              history.push('/')
            }
          }
        }
      },
      (article) => {
        return {
          [CALL_API]: {
            method: 'get',
            path: `/api/users/${article.userId}`,
            successType: LOADED_ARTICLE_USER
          }
        }
      }
    ]
  }
}
