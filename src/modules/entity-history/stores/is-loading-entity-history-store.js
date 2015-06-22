import { Store } from 'nuclear-js';
import actionTypes from '../action-types';

class IsLoadingEntityHistoryEntries extends Store {
  getInitialState() {
    return false;
  }

  initialize() {
    this.on(actionTypes.ENTITY_HISTORY_FETCH_START,
            () => true);
    this.on(actionTypes.ENTITY_HISTORY_FETCH_SUCCESS,
            () => false);
    this.on(actionTypes.ENTITY_HISTORY_FETCH_ERROR,
            () => false);

    this.on(actionTypes.RECENT_ENTITY_HISTORY_FETCH_START,
            () => true);
    this.on(actionTypes.RECENT_ENTITY_HISTORY_FETCH_SUCCESS,
            () => false);
    this.on(actionTypes.RECENT_ENTITY_HISTORY_FETCH_ERROR,
            () => false);

    this.on(actionTypes.LOG_OUT, () => false);
  }
}

const INSTANCE = new IsLoadingEntityHistoryEntries();

export default INSTANCE;
