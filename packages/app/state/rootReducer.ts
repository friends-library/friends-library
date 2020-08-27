import { combineReducers } from '@reduxjs/toolkit';
import audioResources from './audio-resources';
import filesystem from './filesystem';
import playback from './playback';
import preferences from './preferences';

const rootReducer = combineReducers({
  audioResources,
  filesystem,
  playback,
  preferences,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
