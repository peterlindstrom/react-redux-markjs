import { connect } from 'react-redux';
import HighlightText from '../components/HighlightText';
import { setHighlightText, toggleEditor, resetRemoveHighlights, closeContextMenu } from '../actions/highlightText';
import { selectMarking, setCurrentMarking } from '../actions/markings';

const mapStateToProps = state => ({
  selectedMarking: state.markings.selectedMarking,
  markingsToBeRemoved: state.highlightText.markingsToBeRemoved,
  visible: state.highlightText.visible,
  visibleEditor: state.highlightText.visibleEditor,
  markings: state.markings.all,
  index: state.markings.index,
  updatedIndex: state.highlightText.index,
});

const mapDispatchToProps = dispatch => ({
  setHighlightText: (params) => {
    dispatch(setHighlightText(params));
  },
  toggleEditor: (visible) => {
    dispatch(toggleEditor(visible));
  },
  selectMarking: (id) => {
    dispatch(selectMarking(id));
  },
  setCurrentMarking: marking => dispatch(setCurrentMarking(marking)),
  resetRemoveHighlights: () => dispatch(resetRemoveHighlights()),
  closeContextMenu: () => dispatch(closeContextMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HighlightText);
