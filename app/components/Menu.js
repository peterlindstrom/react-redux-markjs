import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from '../containers/Editor';

const MIN_WIDTH = 250;
const MIN_HEIGHT = 200;

class Menu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      elWidth: MIN_WIDTH,
      elHeight: MIN_HEIGHT,
    };
    this.openEditor = this.openEditor.bind(this);
  }

  componentDidMount() {
    this.props.fetchMarkings();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.visible !== this.props.visible ||
      nextProps.visibleEditor !== this.props.visibleEditor ||
      nextProps.posX !== this.props.posX ||
      nextProps.posY !== this.props.posY ||
      nextState.elWidth !== this.state.elWidth ||
      nextState.elHeight !== this.state.elHeight) {
      return true;
    }
    return false;
  }
  componentDidUpdate() {
    this.menu.setAttribute('data-istouchdevice', true);

    if (this.props.visible && this.menu) {
      window.requestAnimationFrame(() => {
        this.setState({
          elWidth: this.menu.getBoundingClientRect().width,
          elHeight: this.menu.getBoundingClientRect().height,
        });
      });
    }
  }

  openEditor() {
    this.props.openEditor();
  }

  render() {
    const { visible, visibleEditor } = this.props;
    return (
      <div
        className="menu"
        hidden={!visible}
        aria-hidden={!visible}
        ref={(el) => { this.menu = el; }}
      >
        { visibleEditor ? <Editor visibleEditor={visibleEditor} /> :
          <div>
            <button
              key="Highlight text"
              className="menu-option"
              onClick={this.openEditor}
            >
              <span className="menu-text">Highlight text</span>
            </button>
          </div> }
      </div>
    );
  }
}

Menu.propTypes = {
  posY: PropTypes.number,
  posX: PropTypes.number,
  visible: PropTypes.bool,
  visibleEditor: PropTypes.bool,
  fetchMarkings: PropTypes.func,
  openEditor: PropTypes.func,
};

export default Menu;
