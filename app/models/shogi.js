import _ from 'lodash';
import schema from './shogi.yml'; // eslint-disable-line
import { makeModelsAndEnumsFromJsonSchema } from '../utils/json-schema';
import { digit2kanji } from '../utils/shogi';

const models = makeModelsAndEnumsFromJsonSchema(schema);

const PIECE_TO_CHAR = {
  FU: '歩', KY: '香', KE: '桂', GI: '銀', KA: '角', HI: '飛', KI: '金', OU: '王',
  TO: 'と', NY: '杏', NK: '圭', NG: '全', UM: '馬', RY: '竜',
};

const PROMOTE = { FU: 'TO', KY: 'NY', KE: 'NK', GI: 'NG', KA: 'UM', HI: 'RY' };
const DEMOTE = _.invert(PROMOTE);

models.Piece = class extends models.Piece {
  isPromoted() {
    return !this.canPromote() && this.canDemote();
  }
  canPromote() {
    return Object.hasOwnProperty.call(PROMOTE, this.data);
  }
  promote() {
    return this.canPromote() ? new this.constructor(PROMOTE[this.data]) : null;
  }
  promoteIfPossible() {
    return this.promote() || this.clone();
  }
  canDemote() {
    return Object.hasOwnProperty.call(DEMOTE, this.data);
  }
  demote() {
    return this.canDemote() ? new this.constructor(DEMOTE[this.data]) : null;
  }
  demoteIfPossible() {
    return this.demote() || this.clone();
  }
  toChar(opts = {}) {
    if (this.data === 'OU' && opts.side === 'black') {
      return '玉';
    }
    return PIECE_TO_CHAR[this.data];
  }
};

const STATE_PRESETS = {
  [models.STATE_PRESET.EMPTY]: { hands: { black: [], white: [] }, board: [] },
  [models.STATE_PRESET.DEFAULT]: {
    hands: { black: [], white: [] },
    board: [
      ...['KY', 'KE', 'GI', 'KI', 'OU', 'KI', 'GI', 'KE', 'KY'].map((v, i) => ({ side: 'white', position: { x: i + 1, y: 1 }, piece: v })),
      { side: 'white', position: { x: 8, y: 2 }, piece: 'HI' }, { side: 'white', position: { x: 2, y: 2 }, piece: 'KA' },
      ...[...Array(9).keys()].map(i => ({ side: 'white', position: { x: i + 1, y: 3 }, piece: 'FU' })),
      ...[...Array(9).keys()].map(i => ({ side: 'black', position: { x: i + 1, y: 7 }, piece: 'FU' })),
      { side: 'black', position: { x: 2, y: 8 }, piece: 'HI' }, { side: 'black', position: { x: 8, y: 8 }, piece: 'KA' },
      ...['KY', 'KE', 'GI', 'KI', 'OU', 'KI', 'GI', 'KE', 'KY'].map((v, i) => ({ side: 'black', position: { x: i + 1, y: 9 }, piece: v })),
    ],
  },
};

models.Hand = class extends models.Hand {
  capture(pieceOrData) {
    const p = (new models.Piece(pieceOrData)).demoteIfPossible();
    this.data[p.data] += 1;
  }
  drop(pieceOrData, { strict } = {}) {
    const p = (new models.Piece(pieceOrData)).demoteIfPossible();
    if (strict && !this.has(p)) {
      throw new Error(`This hand has no pieces of ${p.data}.`);
    }
    this.data[p.data] = Math.max(0, this.data[p.data] - 1);
  }
  has(pieceOrData) {
    const p = (new models.Piece(pieceOrData)).demoteIfPossible();
    return this.data[p.data] > 0;
  }
};

models.State = class extends models.State {
  smash() {
    return this.data.preset ? this.constructor.preset(this.data.preset) : this;
  }
  static preset(name) {
    return new this.constructor(STATE_PRESETS[name]);
  }
  getHand(sideData) {
    return new models.Hand(this.data.hand[sideData]);
  }
  checkMovable(moveEvent) {
  }
  move(moveEvent, opts_ = {}) {
    const opts = Object.assign({
      checkRule: false,
    }, opts_);
    const state = this.smash();
    const isDrop = moveEvent.isDrop();
    const hand = this.getHand(moveEvent.data.side);
    const fromPob = isDrop ? null : state.data.board.find(pob =>
      pob.position.x === moveEvent.data.from.x && pob.position.y === moveEvent.data.from.y);
    const toPob = state.data.board.find(pob =>
      pob.position.x === moveEvent.data.to.x && pob.position.y === moveEvent.data.to.y);
    if (opts.checkRule) {
      if (isDrop) {
        if (!hand.has(moveEvent.data.piece)) {
          // TODO: error
        }
        if (toPob) {
          // TODO error
        }
      } else {
        if (!fromPob) {
          // TODO: error
        }
        if (fromPob.side !== moveEvent.data.side) {
          // TODO: error
        }
        // TODO: canMove
      }
    }
    return state;
  }
};

models.Position = class extends models.Position {
  toString() {
    return `${this.data.x}${digit2kanji(this.data.y)}`;
  }
};

models.Record = class extends models.Record {
  getNthMoveContext(n) {
    if (n <= 0) {
      throw new Error(`Argument 1 should be greater than 0 (given ${n})`);
    }
    const move = this.data.events.find(function (ev) {
      if (ev.type === 'move') {
        this.n += 1;
        return this.n === n;
      }
      return false;
    }, { n: 0 });
    const state = this.getStateAfterNthMove(n - 1);
    return {
      side: move.side,
      from: move.fron,
      to: move.to,
      piece: move.piece,
      movements: [],
      isPromoted: 0,
    };
  }
  getStateAfterNthMove(n) {
    if (n < 0) {
      throw new Error(`Argument 1 should be greater than or equal to 0 (given ${n})`);
    }
    // TODO: n手目のstate
    return this.data.state;
  }
};

models.MoveEvent = class extends models.MoveEvent {
  isDrop() {
    return !this.data.from;
  }
};

export default models;
