import reducer from 'reducers/articleDetail'
import * as ActionType from 'actions/articles'
import Immutable from 'immutable'

describe('Reducer::::ArticleDetail', function(){
  describe('on ACTION_TYPE', function(){
    describe('on LOADED_QUESTION_DETAIL', function(){
      it('merges state to response', function(){
        let action = {
          type: ActionType.LOADED_ARTICLE_DETAIL,
          response: { key: 'val' }
        }

        let newState = reducer(undefined, action)

        expect(newState.toJS()).to.deep.equal({ user: {}, key: 'val' })
      })
    })

    describe('on LOADED_ARTICLE_USER', function(){
      it('merge `user` to state', function(){
        let action = {
          type: ActionType.LOADED_ARTICLE_USER,
          response: { key: 'val' }
        }
        let initState = Immutable.fromJS({
          id: 'the-article-id',
          user: {}
        })
        let newState = reducer(initState, action)

        expect(newState.toJS()).to.deep.equal({
          id: 'the-article-id',
          user: {
            key: 'val'
          }
        })
      })
    })
  })
})
