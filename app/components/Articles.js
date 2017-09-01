import React, { Component } from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { List } from 'immutable'

class Articles extends Component {
  render() {
    return (
      <div>
        Articles component
        {
          this.props.articles.map((q)=> {
            let id = q.get('id')
            return (
              <div key={id}>
                <Link to={`/articles/${id}`}> { q.get('content') }</Link>
              </div>
            )
          })
        }
        <Link to={`/articles/not-found`}> This link would be redirected to Index</Link>
      </div>
    )
  }
}

Articles.propTypes = {
  articles: PropTypes.instanceOf(List).isRequired
}

export default Articles
