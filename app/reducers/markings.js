import * as ActionType from '../actions/markings'
import * as ActionTypeHighlightText from '../actions/highlightText'

let defaultState = {
  all: [],
  selectedMarking: null,
  index: 0,
  searchTerm: '',
};

const markingsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ActionType.FETCH_MARKINGS:
      return {
        ...state,
        all: action.payload.map(
          marking => ({
            ...marking,
          }),
        ),
      };
    case ActionType.UPDATE_MARKING: {
      const all = state.all.map((marking) => {
        let newMarking = Object.assign({}, marking);
        if (marking.id === action.payload.id) {
          newMarking = action.payload;
        }
        return newMarking;
      });

      return {
        ...state,
        all,
        selectedMarking: null,
        index: state.index + 1,
      };
    }
    case ActionType.ADD_MARKING: {
      let newMarking = action.payload;
      newMarking = {
        ...newMarking,
      };
      return {
        ...state,
        selectedMarking: null,
        all: [newMarking, ...state.all],
      };
    }
    case ActionType.DELETE_MARKING: {
      const all = state.all.filter(marking => marking.id !== action.payload);
      return {
        ...state,
        selectedMarking: null,
        all,
      };
    }
    case ActionType.SELECT_MARKING: {
      const selectedMarking = state.all.find(({ id }) => id === action.payload);

      if (!selectedMarking) {
        return state;
      }

      return {
        ...state,
        selectedMarking,
      };
    }
    case ActionType.SET_CURRENT_MARKING:
      return {
        ...state,
        selectedMarking: action.payload,
      };
    case ActionTypeHighlightText.CLOSE_CONTEXT_MENU:
      return {
        ...state,
        selectedMarking: null,
      };

    default:
  }

  return state;
};

export default markingsReducer;
