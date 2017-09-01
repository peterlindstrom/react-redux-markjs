import { CALL_API, CHAIN_API } from 'middleware/api'

import * as actionCreator from 'actions/articles'
import * as ActionType from 'actions/articles'

describe('Action::Article', function(){
  describe('#loadArticles()', function(){
    it('returns action `CALL_API` info', function(){
      let action = actionCreator.loadArticles()
      expect(action[CALL_API]).to.deep.equal({
        method: 'get',
        path: '/api/articles',
        successType: ActionType.LOADED_ARTICLES
      })
    })
  })

  describe('#loadArticlesDetail({id})', function(){
    let id = 'the-id'
    it('returns a CHAIN_API to fetch article first', function(){
      let action = actionCreator.loadArticleDetail({ id })
      let callApi = action[CHAIN_API][0]()[CALL_API]

      expect(callApi.method).to.equal('get')
      expect(callApi.path).to.equal(`/api/articles/${id}`)
      expect(callApi.successType).to.equal(ActionType.LOADED_ARTICLE_DETAIL)
    })
    it('navigates to root when request error', ()=> {
      let mockHistory = {
        push: sinon.stub()
      }
      let action = actionCreator.loadArticleDetail({ id, history: mockHistory })
      let callApi = action[CHAIN_API][0]()[CALL_API]

      expect(callApi.afterError).to.be.an.instanceOf(Function)
      callApi.afterError()

      expect(mockHistory.push).to.have.been.calledWith('/')
    })
    it('fetches user data after fetching article', function(){
      let action = actionCreator.loadArticleDetail({ id })
      let articleRes = { userId: '1234' }

      expect(action[CHAIN_API][1](articleRes)[CALL_API]).to.deep.equal({
        method: 'get',
        path: `/api/users/${articleRes.userId}`,
        successType: ActionType.LOADED_ARTICLE_USER
      })
    })
  })
})
