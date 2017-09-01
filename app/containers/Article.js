import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadArticleDetail } from 'actions/articles'
import Helmet from 'react-helmet'
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import HighlightText from './HighlightText'
import Menu from './Menu'

class Article extends Component {
  static fetchData({ store, params, history }) {
    let { id } = params
    return store.dispatch(loadArticleDetail({ id, history }))
  }
  componentDidMount() {
    let { id } = this.props.params
    this.props.loadArticleDetail({ id, history: browserHistory })
  }
  render() {
    let { article } = this.props
    let markings = null;
    if (global && global.Mark) {
      markings = <div>
        <HighlightText articleId={`article-${this.props.params.id}`}/>
        <Menu />
      </div>
    }
    return (
      <div>
        <Helmet
          title={'Article ' + this.props.params.id}
        />
        <div className="article" id={`article-${this.props.params.id}`}>
          <h2>{ article.get('content') }</h2>
          <h3> User: {article.getIn(['user', 'name'])} </h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus
            ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.
            Fusce nec tellus sed augue semper porta. Mauris massa. <b>Lorem ipsum dolor sit amet, consectetur adipiscing
              elit</b>. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia
            nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. <i>Lorem ipsum dolor sit amet, consectetur
              adipiscing elit</i>. Sed dignissim lacinia nunc. <b>Praesent mauris</b>. Curabitur tortor. Pellentesque nibh.
            Aenean quam. <i>Lorem ipsum dolor sit amet, consectetur adipiscing elit</i>. In scelerisque sem at dolor.
            Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus,
            iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. <b>Aenean
              quam</b>. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum
            velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante.
            <b>Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa</b>. Sed lacinia, urna non tincidunt
            mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. <b>Proin ut ligula vel
              nunc egestas porttitor</b>. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet.
            Vestibulum sapien. Proin quam. Etiam ultrices. <b>Nam nec ante</b>. Suspendisse in justo eu magna luctus
            suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus, metus vitae pharetra auctor, sem massa
            mattis sem, at interdum magna augue eget diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
            posuere cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam. In vel mi sit amet
            augue congue elementum. Morbi in ipsum sit amet pede facilisis laoreet. <b>Suspendisse in justo eu magna luctus
              suscipit</b>. Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada
            tellus. Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. </p>
        </div>
        <p><strong>Select some text in the article above</strong></p>
        {markings && markings}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { article: state.articleDetail }
}

Article.propTypes = {
  article: PropTypes.object.isRequired
}

export { Article }
export default connect(mapStateToProps, { loadArticleDetail })(Article)
