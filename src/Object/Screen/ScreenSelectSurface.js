import Canvas3d from '@/Object/Screen/Canvas3d';

export default class ScreenSelectSurface extends Canvas3d {
  constructor(width, height, canvasResX = 1024, canvasResY = 1024) {
    super(width, height, canvasResX, canvasResY);

    this.setContent('player', 1);
    this.setContent('minatures', [
        {id: 1, score: 0, name: 'Loop'},
        {id: 3, score: '6000', name: 'Cross'},
        {id: 5, score: '16000', name: 'Medal'},
        {id: 7, score: '32000', name: 'Clover'},
        {id: 9, score: '54000', name: 'Staircase'},
        {id: 11, score: '74000', name: 'Plane'},
        {id: 13, score: '94000', name: 'Star'},
        {id: 15, score: '114000', name: 'Mountains'},
        {id: 17, score: '134000', name: 'Loop'},
        {id: 20, score: '152000', name: 'Peanut'},
        {id: 22, score: '170000', name: 'Triangle'},
        {id: 24, score: '188000', name: 'The V'},
        {id: 26, score: '208000', name: 'Bowl'},
        {id: 28, score: '226000', name: 'ILY'},
        {id: 31, score: '248000', name: 'Mountains'},
        {id: 33, score: '265000', name: 'Loop'},
        {id: 36, score: '300000', name: 'Peanut'},
        {id: 40, score: '340000', name: 'The V'},
        {id: 44, score: '382000', name: 'ILY'},
        {id: 47, score: '415000', name: 'Mountains'},
        {id: 49, score: '439000', name: 'Loop'},
        {id: 52, score: '492000', name: 'Peanut'},
        {id: 56, score: '531000', name: 'The V'},
        {id: 60, score: '591000', name: 'ILY'},
        {id: 63, score: '624000', name: 'Mountains'},
        {id: 65, score: '656000', name: 'Loop'},
        {id: 73, score: '766000', name: 'Staircase'},
        {id: 81, score: '848000', name: 'Loop'},
      ]
    );
    this.debug = true;
  }

  draw() {
    //TODO

    //<To remove>


    //</To remove>

    this.setFontSizePx(30);
    // this.drawText('© mcmlxxx Atari', 355, 60, Canvas3d.COLOR_BLUE);
    this.drawText('rate yourself', 370, 420, Canvas3d.COLOR_GREEN);
    this.drawText('Spin knob to change', 300, 460, Canvas3d.COLOR_CYAN);
    this.drawText('Press fire to select', 290, 500, Canvas3d.COLOR_YELLOW);
    this.drawText('novice', 160, 600, Canvas3d.COLOR_RED);
    this.drawText('expert', 785, 600, Canvas3d.COLOR_RED);
    this.drawText('level', 30, 650, Canvas3d.COLOR_GREEN);
    // this.drawText('1', 230, 650, Canvas3d.COLOR_GREEN);
    // this.drawText('3', 380, 650, Canvas3d.COLOR_GREEN);
    // this.drawText('5', 530, 650, Canvas3d.COLOR_GREEN);
    // this.drawText('7', 680, 650, Canvas3d.COLOR_GREEN);
    // this.drawText('9', 830, 650, Canvas3d.COLOR_GREEN);
    this.drawText('hole', 30, 710, Canvas3d.COLOR_GREEN);
    this.drawText('bonus', 30, 770, Canvas3d.COLOR_GREEN);
    for (let i = 0; i < this.getContent('minatures').length; i++) {
      this.drawText(this.alignNumberToRight(this.getContent('minatures')[i].id), 230 + (i * 50), 650, Canvas3d.COLOR_GREEN);
      this.drawText(this.alignNumberToRight(this.getContent('minatures')[i].score), 280 + (i * 50), 770, Canvas3d.COLOR_RED);

    }

    // this.drawText('0', 280, 770, Canvas3d.COLOR_RED);
    // this.drawText('6000', 355, 770, Canvas3d.COLOR_RED);
    this.setFontSizePx(60);
    this.drawText('Player 1', 335, 350, Canvas3d.COLOR_WHITE);

    //Icon example
    this.drawMapIcon(205, 665, 1);
    this.drawMapIcon(355, 665, 2);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param level
   * @param scale
   */
  drawMapIcon(x, y, level, scale = 1) {
    //Chwilowo wyświetl to zamiast miniaturki mapy
    //Unit upraszcza skalowanie. Można dowolnie zmieniać mnożnik (3) by dostosować wielkość rysunku.
    let unit = 7 * scale;

    //Ustawienie koloru
    //this.context to context canvas, można tu robić wszystko, co da się robić z canvasem.
    //  W dokumentacji zazwyczaj oznaczany jest jako ctx.
    this.context.strokeStyle = Canvas3d.COLOR_BLUE;

    //Rysowanie ścieżki
    //Przy rysowaniu x,y to zawsze lewy górny róg obiektu (a raczej prostokąta opisanego na obiekcie). Zawsze.
    this.context.beginPath();
    this.context.moveTo(x + 5 * unit, y);
    this.context.lineTo(x, y + 5 * unit);
    this.context.lineTo(x + 5 * unit, y + 10 * unit);
    this.context.lineTo(x + 10 * unit, y + 5 * unit);
    this.context.lineTo(x + 5 * unit, y);
    this.context.stroke();
  }
}
