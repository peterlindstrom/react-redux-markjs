import * as ActionType from 'actions/articles'
import Immutable from 'immutable'

let defaultState = Immutable.fromJS([])
function articlesReducer (state = defaultState, action) {
  switch(action.type) {
    case ActionType.LOADED_ARTICLES:
      return Immutable.fromJS(action.response)
      break
    default:
      return state
  }
}

export default articlesReducer
