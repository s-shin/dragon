<template>
  <div class="c-shogi-record">
    <ol class="c-shogi-record__list">
      <li v-for="move, i in moves" :class="['c-shogi-record__list__item', { 'is-active': currentMove === i + 1 }]">
        <span class="c-shogi-record__list__item__index">{{ i + 1 }}</span>
        <i v-if="move.side === 'black'" class="icon icon--black"></i>
        <i v-else class="icon icon--white"></i>
        <span>{{ move.posStr }}{{ move.pieceStr }}</span>
      </li>
    </ol>
  </div>
</template>

<script>
import shogi from '../../models/shogi';
import { validatorForJsonSchemaModel } from '../../utils/vue';

export default {
  name: 'shogi-record',
  props: {
    record: {
      type: shogi.Record,
      required: true,
      validator: validatorForJsonSchemaModel,
    },
    currentMove: {
      type: Number,
    },
  },
  computed: {
    moves() {
      return this.record.data.events
        .filter(ev => ev.type === 'move')
        .map(ev => ({
          side: ev.side,
          posStr: shogi.Position.of(ev.to).toString(),
          pieceStr: shogi.Piece.of(ev.piece).toChar({ side: ev.side }),
        }));
    },
  },
};
</script>
