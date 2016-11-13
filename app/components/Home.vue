<template>
  <div id="container">
    <header id="header">
      <app-header :title="shogiRecord.data.meta.title"></app-header>
    </header>
    <div id="content">
      <div class="p-board-view">
        <div class="p-board-view__inner">
          <shogi-state :state="shogiState" :player-pair="playerPair"></shogi-state>
        </div>
      </div>
      <div class="p-record-view">
        <panel title="棋譜">
          <shogi-record :record="shogiRecord" :current-move="1"></shogi-record>
        </panel>
      </div>
    </div>
    <!-- <footer id="footer">hoge</footer> -->
  </div>
</template>

<script>
import shogi from '../models/shogi';
import ShogiState from './shogi/State.vue';
import ShogiRecord from './shogi/Record.vue';
import sample001 from '../data/record/sample001.yml';
import AppHeader from './AppHeader.vue';
import Panel from './Panel.vue';

export default {
  name: 'home',
  data() {
    return {
      shogiState: shogi.State.preset('default'),
      playerPair: new shogi.PlayerPair({
        black: {
          name: { last: '羽生' },
        },
        white: {
          name: { last: 'Neo羽生' },
        },
      }),
      shogiRecord: new shogi.Record(sample001),
    };
  },
  components: { AppHeader, Panel, ShogiState, ShogiRecord },
};
</script>
