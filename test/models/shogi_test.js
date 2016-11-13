import assert from 'power-assert';
import shogi from '../../app/models/shogi';

const {
  Piece,
  Hand,
  State,
  MoveEvent,
  SIDE,
  PIECE,
  STATE_PRESET,
} = shogi;

describe('shogi models', () => {
  it('has models and enums by JSON Schema.', () => {
    assert(Piece);
    assert(PIECE);
    assert(PIECE.FU === 'FU');
    const piece = new Piece('FU');
    assert(piece.data === PIECE.FU);
    piece.data = 'KE';
    assert(piece.validate() === null);
  });

  describe('Piece', () => {
    it('has methods to promote and demote.', () => {
      const fu = new Piece(PIECE.FU);
      assert(fu.data === PIECE.FU);
      assert(fu.toChar() === '歩');
      assert(!fu.isPromoted());
      assert(fu.canPromote());
      assert(!fu.canDemote());

      const to = fu.promote();
      assert(to.data === PIECE.TO);
      assert(to.toChar() === 'と');
      assert(to.isPromoted());
      assert(!to.canPromote());
      assert(to.canDemote());
      assert(to.demote().data === PIECE.FU);

      const ki = new Piece(PIECE.KI);
      assert(!ki.isPromoted());
      assert(!ki.canPromote());
      assert(!ki.canDemote());
    });
  });

  describe('Hand', () => {
    it('has a default value in each piece.', () => {
      const hand = new Hand();
      assert(hand.data.FU === 0);
    });
    it('cannot hold promoted pieces.', () => {
      const hand = new Hand({ FU: 2, TO: 3 });
      assert(hand.validate() !== null);
    });
    it('#capture, #has, #drop', () => {
      const hand = new Hand();
      const p = new Piece(PIECE.FU);
      assert(!hand.has(p));
      hand.capture(p);
      assert(hand.has(p));
      assert(hand.data[p.data] === 1);
      hand.drop(p);
      assert(!hand.has(p));
      assert(hand.data[p.data] === 0);
      hand.drop(p);
      assert(hand.data[p.data] === 0);
      assert.throws(() => {
        hand.drop(p, { strict: true });
      });
    });
  });

  describe('State', () => {
    it('should be default preset by default.', () => {
      const state = new State();
      assert(state.data.preset === STATE_PRESET.DEFAULT);
    });
    it.skip('#move', () => {
      const state = State.preset(STATE_PRESET.DEFAULT);
      assert(state.validate() === null);
      const moveEvent = new MoveEvent({
        side: SIDE.BLACK,
        from: { x: 2, y: 7 },
        to: { x: 2, y: 6 },
        piece: PIECE.FU,
      });
      assert(moveEvent.validate() === null);
      const moved = state.move(moveEvent.data);
      assert(moved.validate() === null);
      assert(!!moved.data.board.find(pob =>
        pob.position.x === 2 && pob.position.y === 6 &&
        pob.side === SIDE.BLACK && pob.piece === PIECE.FU));
    });
  });
});
