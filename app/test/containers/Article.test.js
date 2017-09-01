import React from 'react'
import Immutable from 'immutable'
import Container, { Article } from 'containers/Article'
import { mount } from 'enzyme'
import { browserHistory } from 'react-router'

describe('Container::Article', function(){
  let props

  function renderDoc () {
    return mount(<Article {...props}/>)
  }
  beforeEach(function(){
    props = {
      loadArticleDetail: sinon.stub(),
      params: {
        id: 222
      },
      article: Immutable.fromJS({
        id: 222,
        content: 'the-article-content',
        user: {
          id: 1234,
          name: 'jack'
        }
      })
    }
  })

  it('fetches article details on mounted', function(){
    let doc = renderDoc()
    expect(props.loadArticleDetail).to.have.been.calledWith({
      id: props.params.id,
      history: browserHistory
    })
  })

})
