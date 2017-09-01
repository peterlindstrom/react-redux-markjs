import React from 'react'
import { shallow } from 'enzyme'
import { Link } from 'react-router'
import Articles from 'components/Articles'
import Immutable from 'immutable'

describe('Component::Articles', function(){
  let props
  beforeEach(function(){
    props = {
      articles: Immutable.fromJS([
        { id: 1, content: 'the-content-1' },
        { id: 2, content: 'the-content-2' }
      ])
    }
  })
  function renderDoc () {
    return shallow(<Articles {...props} />)
  }

  it('renders articles', function(){
    let doc = renderDoc()
    let articleComps = doc.find(Link)

    expect(articleComps.length).to.equal(props.articles.size + 1)
  })
})
