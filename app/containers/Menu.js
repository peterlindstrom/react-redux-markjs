import { connect } from 'react-redux';
import Menu from '../components/Menu';
import { toggleEditor, closeContextMenu } from '../actions/highlightText';
import { fetchMarkings } from '../actions/markings';

const mapStateToProps = state => {
  return {
    visible: state.highlightText.visible,
      visibleEditor: state.highlightText.visibleEditor,
    posX: state.highlightText.posX,
    posY: state.highlightText.posY,
  }
};

const mapDispatchToProps = dispatch => ({
  fetchMarkings: params => dispatch(fetchMarkings(params)),
  openEditor: () => dispatch(toggleEditor(true)),
  close: () => dispatch(closeContextMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

