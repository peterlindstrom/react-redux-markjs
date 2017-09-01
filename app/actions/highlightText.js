export const HIGHLIGHT_TEXT = Symbol('HIGHLIGHT_TEXT');
export const setHighlightText = payload => ({
  type: HIGHLIGHT_TEXT,
  payload,
});

export const TOGGLE_EDITOR = Symbol('TOGGLE_EDITOR');
export const toggleEditor = visible => ({
  type: TOGGLE_EDITOR,
  payload: visible,
});

export const REMOVE_HIGHLIGHTS = Symbol('REMOVE_HIGHLIGHTS');
export const removeHighlights = markingIds => ({
  type: REMOVE_HIGHLIGHTS,
  payload: markingIds,
});

export const RESET_REMOVE_HIGHLIGHTS = Symbol('RESET_REMOVE_HIGHLIGHTS');
export const resetRemoveHighlights = () => ({
  type: RESET_REMOVE_HIGHLIGHTS,
});

export const CLOSE_CONTEXT_MENU = Symbol('CLOSE_CONTEXT_MENU');
export const closeContextMenu = () => ({
  type: CLOSE_CONTEXT_MENU,
});

export default setHighlightText;
