import Canvas3d from '@/Object/Screen/Canvas3d';

export default class ScreenSelectSurface extends Canvas3d {
  constructor (width, height, canvasResX = 1024, canvasResY = 1024) {
    super(width, height, canvasResX, canvasResY);

    this.setContent('player', 1);
    this.debug = true;
  }

  draw () {
    //TODO

    //<To remove>
    this.setFontSizePx(60);
    this.drawText('Select surface', 20, 1000, Canvas3d.COLOR_GREEN);
    //</To remove>

    //Icon example
    this.drawMapIcon(50, 50, 1);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param level
   * @param scale
   */
  drawMapIcon (x, y, level, scale = 1) {
    //Chwilowo wyświetl to zamiast miniaturki mapy
    //Unit upraszcza skalowanie. Można dowolnie zmieniać mnożnik (3) by dostosować wielkość rysunku.
    let unit = 3 * scale;

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
