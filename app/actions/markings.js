import Persist from '../persist';

export const FETCH_MARKINGS = Symbol('FETCH_MARKINGS');
export const fetchMarkings = () => ({
  type: FETCH_MARKINGS,
  payload: Persist.fetchMarkings(),
});

export const ADD_MARKING = Symbol('ADD_MARKING');
export const addMarking = (marking) => ({
  type: ADD_MARKING,
  payload: Persist.addMarking(marking),
});

export const UPDATE_MARKING = Symbol('UPDATE_MARKING');
export const updateMarking = (marking) => ({
  type: UPDATE_MARKING,
  payload: Persist.updateMarking(marking),
});

export const DELETE_MARKING = Symbol('DELETE_MARKING');
export const deleteMarking = (markingId) => ({
  type: DELETE_MARKING,
  payload: Persist.deleteMarking(markingId),
});

export const SELECT_MARKING = Symbol('SELECT_MARKING');
export const selectMarking = markingId => ({
  type: SELECT_MARKING,
  payload: markingId,
});

export const SET_CURRENT_MARKING = Symbol('SET_CURRENT_MARKING');
export const setCurrentMarking = marking => ({
  type: SET_CURRENT_MARKING,
  payload: marking,
});
