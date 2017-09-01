import articleReducer from 'reducers/articles'
import * as ActionType from 'actions/articles'

describe('Reducer::Article', function(){
  it('returns an empty array as default state', function(){
    let action = { type: 'unknown' }
    let newState = articleReducer(undefined, { type: 'unknown' })
    expect(newState.toJS()).to.deep.equal([])
  })

  describe('on LOADED_ARTICLES', function(){
    it('returns the `response` in given action', function(){
      let action = {
        type: ActionType.LOADED_ARTICLES,
        response: { responseKey: 'responseVal' }
      }
      let newState = articleReducer(undefined, action)
      expect(newState.toJS()).to.deep.equal(action.response)
    })
  })
})
