<template>
  <div class="c-shogi-state" style="display: flex; align-content: streach">
    <div v-if="playerPair" style="display: flex;">
      <div class="c-shogi-state__hand is-white">
        <span class="c-shogi-state__hand__player-name">
          <i class="icon-v icon--white"></i>
          {{ playerName(playerPair.data.white) }}
        </span>
        <span v-for="p in hands.white">{{ p.pieceStr }}{{ p.numStr }}</span>
      </div>
    </div>
    <div>
      <div class="c-shogi-state__board">
        <table>
          <tr v-for="(row, y) in board">
            <td v-for="(pob, x) in row">
              <div class="c-shogi-state__board__cell">
                <span v-if="pob" :class="['c-shogi-state__board__piece', `is-${pob.side}`]">{{ pob.pieceStr }}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="playerPair" style="display: flex;">
      <div class="c-shogi-state__hand is-black">
        <span class="c-shogi-state__hand__player-name">
          <i class="icon-v icon--black"></i>
          {{ playerName(playerPair.data.black) }}
        </span>
        <span v-for="p in hands.black">{{ p.pieceStr }}{{ p.numStr }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import shogi from '../../models/shogi';
import { validatorForJsonSchemaModel } from '../../utils/vue';
import { digit2kanji } from '../../utils/shogi';

export default {
  name: 'shogi-board',
  props: {
    state: {
      type: shogi.State,
      required: true,
      validator: validatorForJsonSchemaModel,
    },
    playerPair: {
      type: shogi.PlayerPair,
      validator: validatorForJsonSchemaModel,
    },
  },
  computed: {
    stateData() {
      return this.state.smash().data;
    },
    hands() {
      const viewData = {};
      ['black', 'white'].forEach((side) => {
        viewData[side] = [];
        const hand = this.stateData.hands[side];
        ['HI', 'KA', 'KI', 'GI', 'KE', 'KY', 'FU'].forEach((piece) => {
          const num = hand.filter(p => p === piece).length;
          if (num > 0) {
            viewData[side].push({
              pieceStr: shogi.Piece.of(piece).toChar({ side }),
              numStr: num > 1 ? digit2kanji(num) : '',
            });
          }
        });
      });
      return viewData;
    },
    board() {
      const table = Array(9).fill(null).map(() => Array(9).fill(null));
      for (const pob of this.stateData.board) {
        table[pob.position.y - 1][9 - pob.position.x] = {
          side: pob.side,
          pieceStr: shogi.Piece.of(pob.piece).toChar({ side: pob.side }),
        };
      }
      return table;
    },
  },
  methods: {
    playerName(playerData) {
      return playerData.name.last || playerData.name.first;
    },
  },
};
</script>
