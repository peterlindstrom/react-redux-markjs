import { combineReducers } from 'redux'
import articles from 'reducers/articles'
import articleDetail from 'reducers/articleDetail'
import highlightText from 'reducers/highlightText'
import markings from 'reducers/markings'

const rootReducer = combineReducers({
  articles,
  articleDetail,
  highlightText,
  markings,
})

export default rootReducer
