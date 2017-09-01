import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadArticles } from 'actions/articles'
import { Link } from 'react-router'
import Articles from 'components/Articles'
import Helmet from 'react-helmet'

class ArticleContainer extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadArticles())
  }

  componentDidMount() {
    this.props.loadArticles()
  }
  render() {
    return (
      <div>
        <Helmet
          title="Articles"
        />
        <h2>Articles</h2>
        <Articles articles={this.props.articles} />
        <Link to="/">Back to Home</Link>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { articles: state.articles }
}

export { ArticleContainer }
export default connect(mapStateToProps, { loadArticles })(ArticleContainer)
