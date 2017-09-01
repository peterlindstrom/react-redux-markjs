import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import configureStore from 'store/configureStore'
import App from 'containers/App'
import Intro from 'containers/Intro'
import Articles from 'containers/Articles'
import Article from 'containers/Article'

export default function(history) {

  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="articles" component={Articles} />
        <Route path="articles/:id" component={Article} />
        <IndexRoute component={Intro} />
      </Route>
    </Router>
  )
}
