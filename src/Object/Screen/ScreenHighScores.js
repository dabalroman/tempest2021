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
        { score: 147098, name: 'AAA' },
        { score: 62650, name: 'AAA' },
        { score: 10101, name: 'EJD' },
        { score: 10101, name: 'DES' },
        { score: 10101, name: 'MPH' },
        { score: 10101, name: 'DFT' },
        { score: 10101, name: 'SDL' },
        { score: 10101, name: 'MJP' },
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
    this.setFontSizePx(60);
    this.drawText('HIGH SCORES', 20, 1000, Canvas3d.COLOR_GREEN);
    //</To remove>

    //this.getContent(key) pozwala na pobranie danej wartości
    //this.alignNumberToRight(number) formatuje liczbę tak, by zajmowała 6 znaków z wyrównaniem do prawej
    //this.drawText(text, x, y, color) renderuje text w pozycji x, y, w danym color
    this.setFontSizePx(30);
    this.drawText(this.alignNumberToRight(this.getContent('bestScore').score), 400, 90, Canvas3d.COLOR_BLUE);
    this.drawText(this.getContent('bestScore').name, 560, 90, Canvas3d.COLOR_BLUE);
  }
}
