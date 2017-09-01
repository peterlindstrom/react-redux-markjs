import { ArticleContainer } from 'containers/Articles'
import Articles from 'components/Articles'
import { Link } from 'react-router'
import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

describe('Container::Articles', function(){
  let props
  beforeEach(function(){
    props = {
      loadArticles: sinon.stub(),
      articles: Immutable.fromJS([
        { id: 1, content: 'article content 1' },
        { id: 2, content: 'article content 1' }
      ])
    }
  })

  it('renders Articles with articles in props', function(){
    let doc = shallow(<ArticleContainer {...props}/>)
    let articlesComp = doc.find(Articles)

    expect(articlesComp.props().articles).to.equal(props.articles)
  })
  it('renders a link back to `/`', function(){
    let doc = shallow(<ArticleContainer {...props}/>)
    let link = doc.find('Link')

    expect(link).to.exist
    expect(link.props().to).to.equal('/')
  })
})
