
import { connect } from 'react-redux';
import Editor from '../components/Editor';
import { addMarking, updateMarking, deleteMarking, setCurrentMarking } from '../actions/markings';
import { toggleEditor, removeHighlights } from '../actions/highlightText';

const mapStateToProps = state => ({
  articleId: state.highlightText.articleId,
  visibleEditor: state.highlightText.visibleEditor,
  selectedMarking: state.markings.selectedMarking,
});

const mapDispatchToProps = dispatch => ({
  addMarking: (marking) => {
    dispatch(addMarking(marking));
  },
  updateMarking: (marking) => {
    dispatch(updateMarking(marking));
  },
  deleteMarking: (markingId) => {
    dispatch(deleteMarking(markingId));
  },
  removeHighlights: markingIds => dispatch(removeHighlights(markingIds)),
  resetCurrentMarking: () => dispatch(setCurrentMarking(null)),
  close: () => dispatch(toggleEditor(false)),
});

export default connect(
  mapStateToProps, mapDispatchToProps)(Editor);
