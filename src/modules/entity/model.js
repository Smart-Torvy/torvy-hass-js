import nuclearJS from 'nuclear-js';
import MediaPlayer from './domain-model/media_player';
import parseDateTime from '../../util/parse-date-time-str';
import { callApi } from '../api';

const { Immutable, toJS } = nuclearJS;
const ENTITY = 'entity';

const ImmutableEntity = new Immutable.Record({
  entityId: null,
  domain: null,
  objectId: null,
  state: null,
  entityDisplay: null,
  stateDisplay: null,
  lastChanged: null,
  lastChangedAsDate: null,
  lastUpdated: null,
  lastUpdatedAsDate: null,
  attributes: {},
  isCustomGroup: null,
}, 'Entity');

class State extends ImmutableEntity {
  constructor(entityId, state, lastChanged, lastUpdated, attributes = {}) {
    const [domain, objectId] = entityId.split('.');
    let stateDisplay = state.replace(/_/g, ' ');

    if (attributes.unit_of_measurement) {
      stateDisplay += ` ${attributes.unit_of_measurement}`;
    }

    super({
      entityId,
      domain,
      objectId,
      state,
      stateDisplay,
      lastChanged,
      lastUpdated,
      attributes,
      entityDisplay: attributes.friendly_name || objectId.replace(/_/g, ' '),
      lastChangedAsDate: parseDateTime(lastChanged),
      lastUpdatedAsDate: parseDateTime(lastUpdated),
      isCustomGroup: domain === 'group' && !attributes.auto,
    });
  }

  get id() {
    return this.entityId;
  }

  domainModel(hass) {
    if (this.domain !== 'media_player') {
      throw new Error('Domain does not have a model');
    }
    return new MediaPlayer(hass, this);
  }

  static delete(reactor, instance) {
    return callApi(reactor, 'DELETE', `states/${instance.entityId}`);
  }

  static save(reactor, instance) {
    const { entityId, state, attributes = {} } = toJS(instance);
    const payload = { state, attributes };

    return callApi(reactor, 'POST', `states/${entityId}`, payload);
  }

  static fetch(reactor, id) {
    return callApi(reactor, 'GET', `states/${id}`);
  }

  static fetchAll(reactor) {
    return callApi(reactor, 'GET', 'states');
  }

  static fromJSON({ entity_id, state, last_changed, last_updated, attributes }) {
    /* eslint-disable camelcase */
    return new State(entity_id, state, last_changed, last_updated, attributes);
    /* eslint-enable camelcase */
  }

}

State.entity = ENTITY;

export default State;
