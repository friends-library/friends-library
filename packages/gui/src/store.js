// @flow
import { configureStore } from 'redux-starter-kit'
import rootReducer from './reducers'

export default configureStore({
  reducer: rootReducer,
  preloadedState: {
    friends: {},
    repos: [],
  },
});
