let _ = require('lodash')

function article (id) {
  let sampleContent = '--the article content--'
  return {
    id,
    content: `sample-${id}: ${sampleContent}`,
    user_id: id
  }
}

export const articles = _.range(1, 10).map((i)=> article(i))
export function getUser (id) {
  return {
    id,
    name: `user name - ${id}`
  }
}
export function getArticle (id) {
  if (id === 'not-found') {
    return null
  }
  return article(id)
}
