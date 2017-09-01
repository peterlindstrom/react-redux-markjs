import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

class App extends Component {
  render() {
    return (
      <div>
        <Helmet
          defaultTitle="React Redux Markjs example"
          titleTemplate="%s - Redux Redux Markjs example"
          meta={[
            {"name": "description", "content": "isomorphic rendering with Redux + React-router + Express + Markjs clientside"},
          ]}
          htmlAttributes={{"lang": "en"}}
        />
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(App)
