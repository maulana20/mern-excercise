import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION
} from '../actions/types';

const initialState = {
  notifications: [],
  loading: true,
  error: {}
};

function notificationReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: payload,
        loading: false
      };
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [payload, ...state.notifications],
        loading: false
      };
    default:
      return state;
  }
}

export default notificationReducer;
