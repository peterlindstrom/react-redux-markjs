import * as ActionType from '../actions/highlightText';
import * as ActionTypeMarkings from '../actions/markings';

let defaultState = {
  visible: false,
  visibleEditor: false,
  posX: -200,
  posY: -200,
  markingsToBeRemoved: [],
};

const highlightTextReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.HIGHLIGHT_TEXT: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case ActionType.TOGGLE_EDITOR: {
      const visible = action.payload;
      return {
        ...state,
        visible,
        visibleEditor: visible,
      };
    }
    case ActionTypeMarkings.DELETE_MARKING: {
      return {
        ...state,
        markingsToBeRemoved: [action.payload],
      };
    }
    case ActionTypeMarkings.SET_CURRENT_MARKING: {
      return {
        ...state,
        visible: true,
      };
    }
    case ActionType.CLOSE_CONTEXT_MENU:
      return {
        ...state,
        visible: false,
        visibleEditor: false,
        posX: -200,
        posY: -200,
      };
    case ActionType.REMOVE_HIGHLIGHTS:
      return {
        ...state,
        markingsToBeRemoved: [...state.markingsToBeRemoved, ...action.payload],
      };
    case ActionType.RESET_REMOVE_HIGHLIGHTS:
      return {
        ...state,
        markingsToBeRemoved: [],
      };
    default:

  }
  return state;
};

export default highlightTextReducer;
