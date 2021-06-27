const levels = ([
  { id: 1, selectable: true, scoreBonus: 0, targetScore: 3000 },
  { id: 2, selectable: false, scoreBonus: 0, targetScore: 6000 },
  { id: 3, selectable: true, scoreBonus: 6000, targetScore: 11000 },
  { id: 4, selectable: false, scoreBonus: 0, targetScore: 16000 },
  { id: 5, selectable: true, scoreBonus: 16000, targetScore: 24000 },
  { id: 6, selectable: false, scoreBonus: 0, targetScore: 32000 },
  { id: 7, selectable: true, scoreBonus: 32000, targetScore: 43000 },
  { id: 8, selectable: false, scoreBonus: 0, targetScore: 54000 },
  { id: 9, selectable: true, scoreBonus: 54000, targetScore: 64000 },
  { id: 10, selectable: false, scoreBonus: 0, targetScore: 74000 },
  { id: 11, selectable: true, scoreBonus: 74000, targetScore: 84000 },
  { id: 12, selectable: false, scoreBonus: 0, targetScore: 94000 },
  { id: 13, selectable: true, scoreBonus: 94000, targetScore: 104000 },
  { id: 14, selectable: false, scoreBonus: 0, targetScore: 114000 },
  { id: 15, selectable: true, scoreBonus: 114000, targetScore: 124000 },
  { id: 16, selectable: false, scoreBonus: 0, targetScore: 134000 },
  { id: 17, selectable: true, scoreBonus: 134000, targetScore: 140000 },
  { id: 18, selectable: false, scoreBonus: 0, targetScore: 146000 },
  { id: 19, selectable: false, scoreBonus: 0, targetScore: 152000 },
  { id: 20, selectable: true, scoreBonus: 152000, targetScore: 161000 },
  { id: 21, selectable: false, scoreBonus: 0, targetScore: 170000 },
  { id: 22, selectable: true, scoreBonus: 170000, targetScore: 179000 },
  { id: 23, selectable: false, scoreBonus: 0, targetScore: 188000 },
  { id: 24, selectable: true, scoreBonus: 188000, targetScore: 198000 },
  { id: 25, selectable: false, scoreBonus: 0, targetScore: 208000 },
  { id: 26, selectable: true, scoreBonus: 208000, targetScore: 217000 },
  { id: 27, selectable: false, scoreBonus: 0, targetScore: 226000 },
  { id: 28, selectable: true, scoreBonus: 226000, targetScore: 233300 },
  { id: 29, selectable: false, scoreBonus: 0, targetScore: 240700 },
  { id: 30, selectable: false, scoreBonus: 0, targetScore: 248000 },
  { id: 31, selectable: true, scoreBonus: 248000, targetScore: 256500 },
  { id: 32, selectable: false, scoreBonus: 0, targetScore: 265000 },
  { id: 33, selectable: true, scoreBonus: 265000, targetScore: 276700 },
  { id: 34, selectable: false, scoreBonus: 0, targetScore: 288300 },
  { id: 35, selectable: false, scoreBonus: 0, targetScore: 300000 },
  { id: 36, selectable: true, scoreBonus: 300000, targetScore: 310000 },
  { id: 37, selectable: false, scoreBonus: 0, targetScore: 320000 },
  { id: 38, selectable: false, scoreBonus: 0, targetScore: 330000 },
  { id: 39, selectable: false, scoreBonus: 0, targetScore: 340000 },
  { id: 40, selectable: true, scoreBonus: 340000, targetScore: 350500 },
  { id: 41, selectable: false, scoreBonus: 0, targetScore: 361000 },
  { id: 42, selectable: false, scoreBonus: 0, targetScore: 371500 },
  { id: 43, selectable: false, scoreBonus: 0, targetScore: 382000 },
  { id: 44, selectable: true, scoreBonus: 382000, targetScore: 393000 },
  { id: 45, selectable: false, scoreBonus: 0, targetScore: 404000 },
  { id: 46, selectable: false, scoreBonus: 0, targetScore: 415000 },
  { id: 47, selectable: true, scoreBonus: 415000, targetScore: 427000 },
  { id: 48, selectable: false, scoreBonus: 0, targetScore: 439000 },
  { id: 49, selectable: true, scoreBonus: 439000, targetScore: 456700 },
  { id: 50, selectable: false, scoreBonus: 0, targetScore: 474300 },
  { id: 51, selectable: false, scoreBonus: 0, targetScore: 492000 },
  { id: 52, selectable: true, scoreBonus: 492000, targetScore: 501800 },
  { id: 53, selectable: false, scoreBonus: 0, targetScore: 511500 },
  { id: 54, selectable: false, scoreBonus: 0, targetScore: 521300 },
  { id: 55, selectable: false, scoreBonus: 0, targetScore: 531000 },
  { id: 56, selectable: true, scoreBonus: 531000, targetScore: 546000 },
  { id: 57, selectable: false, scoreBonus: 0, targetScore: 561000 },
  { id: 58, selectable: false, scoreBonus: 0, targetScore: 576000 },
  { id: 59, selectable: false, scoreBonus: 0, targetScore: 591000 },
  { id: 60, selectable: true, scoreBonus: 591000, targetScore: 602000 },
  { id: 61, selectable: false, scoreBonus: 0, targetScore: 613000 },
  { id: 62, selectable: false, scoreBonus: 0, targetScore: 624000 },
  { id: 63, selectable: true, scoreBonus: 624000, targetScore: 640000 },
  { id: 64, selectable: false, scoreBonus: 0, targetScore: 656000 },
  { id: 65, selectable: true, scoreBonus: 656000, targetScore: 669800 },
  { id: 66, selectable: false, scoreBonus: 0, targetScore: 683500 },
  { id: 67, selectable: false, scoreBonus: 0, targetScore: 697300 },
  { id: 68, selectable: false, scoreBonus: 0, targetScore: 711000 },
  { id: 69, selectable: false, scoreBonus: 0, targetScore: 724800 },
  { id: 70, selectable: false, scoreBonus: 0, targetScore: 738500 },
  { id: 71, selectable: false, scoreBonus: 0, targetScore: 752300 },
  { id: 72, selectable: false, scoreBonus: 0, targetScore: 766000 },
  { id: 73, selectable: true, scoreBonus: 766000, targetScore: 776300 },
  { id: 74, selectable: false, scoreBonus: 0, targetScore: 786500 },
  { id: 75, selectable: false, scoreBonus: 0, targetScore: 796800 },
  { id: 76, selectable: false, scoreBonus: 0, targetScore: 807000 },
  { id: 77, selectable: false, scoreBonus: 0, targetScore: 817300 },
  { id: 78, selectable: false, scoreBonus: 0, targetScore: 827500 },
  { id: 79, selectable: false, scoreBonus: 0, targetScore: 837800 },
  { id: 80, selectable: false, scoreBonus: 0, targetScore: 848000 },
  { id: 81, selectable: true, scoreBonus: 848000, targetScore: 855900 },
  { id: 82, selectable: false, scoreBonus: 0, targetScore: 863800 },
  { id: 83, selectable: false, scoreBonus: 0, targetScore: 871700 },
  { id: 84, selectable: false, scoreBonus: 0, targetScore: 879600 },
  { id: 85, selectable: false, scoreBonus: 0, targetScore: 887400 },
  { id: 86, selectable: false, scoreBonus: 0, targetScore: 895300 },
  { id: 87, selectable: false, scoreBonus: 0, targetScore: 903200 },
  { id: 88, selectable: false, scoreBonus: 0, targetScore: 911100 },
  { id: 89, selectable: false, scoreBonus: 0, targetScore: 919000 },
  { id: 90, selectable: false, scoreBonus: 0, targetScore: 926900 },
  { id: 91, selectable: false, scoreBonus: 0, targetScore: 934800 },
  { id: 92, selectable: false, scoreBonus: 0, targetScore: 942700 },
  { id: 93, selectable: false, scoreBonus: 0, targetScore: 950600 },
  { id: 94, selectable: false, scoreBonus: 0, targetScore: 958400 },
  { id: 95, selectable: false, scoreBonus: 0, targetScore: 966300 },
  { id: 96, selectable: false, scoreBonus: 0, targetScore: 974200 },
  { id: 97, selectable: false, scoreBonus: 0, targetScore: 982100 },
  { id: 98, selectable: false, scoreBonus: 0, targetScore: 990000 },
  { id: 99, selectable: false, scoreBonus: 0, targetScore: 999000 },
]);

export default levels;
