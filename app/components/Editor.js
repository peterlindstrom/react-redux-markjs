import React, { Component } from 'react';
import PropTypes from 'prop-types';

const generateUUID = () => (
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* eslint-disable no-bitwise */
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    /* eslint-enable no-bitwise */
    return v.toString(16);
  })
);

class Editor extends Component {

  constructor(props) {
    super(props);
    this.handleTextareaChange = this.handleTextareaChange.bind(this);
    this.onDone = this.onDone.bind(this);
    this.onClear = this.onClear.bind(this);
    this.state = {
      comment: props.selectedMarking ? props.selectedMarking.comment : '',
    };
  }

  componentDidMount() {
    window.requestAnimationFrame(() => {
      if (this.editorArea) {
        this.editorArea.focus();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMarking } = nextProps;
    this.setState({ comment: selectedMarking ? selectedMarking.comment : '' });
  }

  componentDidUpdate() {
    this.editorArea.focus();
  }

  onDone() {
    const {
      updateMarking,
      addMarking,
      close,
      selectedMarking,
    } = this.props;
    if (selectedMarking.id) {
      updateMarking({
        ...selectedMarking,
        comment: this.state.comment,
      });
    } else {
      const newMarking = {
        ...selectedMarking,
        comment: this.state.comment,
        id: generateUUID(),
      };
      addMarking(newMarking);
    }

    this.setState({ comment: '' });
    close();
  }

  onClear() {
    const {
      deleteMarking,
      close,
      selectedMarking,
      resetCurrentMarking,
      removeHighlights,
    } = this.props;

    this.setState({ comment: '' });

    if (selectedMarking.id) {
      deleteMarking(selectedMarking.id);
      removeHighlights([selectedMarking.id]);
    } else {
      resetCurrentMarking();
    }

    close();
  }

  handleTextareaChange(event) {
    this.setState({
      comment: event.target.value,
    });
  }

  render() {
    const { visibleEditor } = this.props;
    return (
      <div
        className={`menu${visibleEditor ? ' visible' : ''}`}
        aria-hidden={visibleEditor}
        ref={(el) => { this.editor = el; }}
      >
        <div className="editor">
          <div className="button-container">
            <button onClick={this.onClear}>Unmark</button>
            <button onClick={this.onDone}>Save</button>
          </div>
          <textarea
            onChange={this.handleTextareaChange}
            value={this.state.comment}
            ref={(el) => { this.editorArea = el; }}
            placeholder={'Here you can write a comment'}
          />
        </div>
      </div>
    );
  }
}

Editor.defaultProps = {
  selectedMarking: {},
};

Editor.propTypes = {
  visibleEditor: PropTypes.bool,
  selectedMarking: PropTypes.shape({
    id: PropTypes.string,
    articleId: PropTypes.string,
    comment: PropTypes.string,
    selectedText: PropTypes.string,
    containerId: PropTypes.string,
    matchingIndex: PropTypes.number,
    currentPage: PropTypes.number,
  }),
  addMarking: PropTypes.func,
  updateMarking: PropTypes.func,
  deleteMarking: PropTypes.func.isRequired,
  resetCurrentMarking: PropTypes.func,
  removeHighlights: PropTypes.func,
  close: PropTypes.func,
};

export default Editor;
