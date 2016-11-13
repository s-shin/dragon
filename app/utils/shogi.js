const DIGIT_TO_KANSUJI = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九' };

export function digit2kanji(n) {
  return DIGIT_TO_KANSUJI[n];
}

export default { digit2kanji };
