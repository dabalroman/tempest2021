import Canvas3d from '@/Object/Screen/Canvas3d';

export default class ScreenHighScores extends Canvas3d {
  constructor (width, height, canvasResX = 1024, canvasResY = 1024) {
    super(width, height, canvasResX, canvasResY);

    //Ustawianie zmiennych do wyświetlenia na ekranie
    //Cokolwiek na ekranie jest dynamiczne, musi zostać zdefiniowane tutaj
    //To jest oczywiście tymczasowe, prawdziwe dane będzie do screen'a wrzucał silnik gry
    this.setContent('score', 147098);
    this.setContent('bestScore', { score: 147098, name: 'AAA' });
    this.setContent('highScores', [
        { score: 147098, name: 'AAA', position: 1 },
        { score: 62650, name: 'AAA', position: 2 },
        { score: 10101, name: 'EJD', position: 3 },
        { score: 10101, name: 'DES', position: 4 },
        { score: 10, name: 'MPH', position: 5 },
        { score: 10101, name: 'DFT', position: 6 },
        { score: 10101, name: 'SDL', position: 7 },
        { score: 10101, name: 'MJP', position: 8 },
      ]
    );
    this.setContent('rankPosition', 1);
    this.setContent('credits', 0);

    //Wyświetla czerwone obramowanie dookoła planszy i '_' zamiast spacji jako output this.alignNumberToRight
    this.debug = true;
  }

  draw () {
    //TODO

    //<To remove>

    //</To remove>

    //this.getContent(key) pozwala na pobranie danej wartości
    //this.alignNumberToRight(number) formatuje liczbę tak, by zajmowała 6 znaków z wyrównaniem do prawej
    //this.drawText(text, x, y, color) renderuje text w pozycji x, y, w danym color
    this.setFontSizePx(30);

    this.drawText(this.alignNumberToRight(this.getContent('bestScore').score), 400, 90, Canvas3d.COLOR_BLUE);
    this.drawText('game over', 423, 140, Canvas3d.COLOR_BLUE);

    this.drawText(this.getContent('bestScore').name, 560, 90, Canvas3d.COLOR_BLUE);

    let highScores = this.getContent('highScores');
    for (let i = 0; i < highScores.length; i++) {
      this.drawText(this.alignNumberToRight(highScores[i].score), 550, 340 + (i * 50), Canvas3d.COLOR_GREEN);
      this.drawText(highScores[i].name, 400, 340 + (i * 50), Canvas3d.COLOR_GREEN);
      this.drawText(this.alignNumberToRight(highScores[i].position), 200, 340 + (i * 50), Canvas3d.COLOR_GREEN);
    }

    this.drawText('Ranking from 1 to 99', 280, 760, Canvas3d.COLOR_YELLOW);
    this.drawText('1.', 360, 810, Canvas3d.COLOR_YELLOW);
    this.drawText('player 1', 450, 810, Canvas3d.COLOR_WHITE);

    // this.drawText('© Peterkowic', 355, 950, Canvas3d.COLOR_GREEN);
    this.drawText('Bonus every 20000', 325, 1000, Canvas3d.COLOR_CYAN);

    this.setFontSizePx(60);
    this.drawText('HIGH SCORES', 260, 260, Canvas3d.COLOR_YELLOW);
  }
}
