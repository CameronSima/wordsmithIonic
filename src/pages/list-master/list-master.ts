import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import { ToastController, LoadingController, FabContainer } from 'ionic-angular';
import { Game, GameResult } from '../../utilities/Game';
import { BonusController } from '../../models/Bonus/BonusController';
import { Word, Letter, Alphabet } from '../../models/wordTypes';
import { Http } from '@angular/http';
import Dictionary from '../../utilities/Dictionary';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  dictionary: Dictionary;
  alphabet: Alphabet;
  rowLength: number;
  rowsAndCols: string[][];
  loading: any;

  constructor(public http: Http,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public game: Game,
    public modalCtrl: ModalController) {
    this.alphabet = Alphabet.Instance;
    this.rowLength = 4;
    this.loading = null; 
  }

  private async startGame() {
    this.startLoader()
    .then(async () => {

      if (!this.dictionary) {
        this.dictionary = new Dictionary(this.http);
        console.log("DICT")
        console.log(this.dictionary)
        let result = await this.dictionary.buildDictionary();
        console.log("RESULT OF DICTIONARY BUILD")
        console.log(result);
      };

      this.game.init(this.dictionary, this);
      this.rowsAndCols = this.getRowsAndCols(this.game.getLetterSet().letters);

      this.loading.dismiss();
      this.game.start((gameResult: GameResult) => {
        this.endGame(gameResult);
      });
    })
  }

  // TODO: Load dict from db, return true if exists
  loadDictionaryFromDb(): boolean {
    return false;
  }

  endGame(result: GameResult) {
    let endingModal = this.modalCtrl.create('GameReportPage', { gameResult: result, game: this.game });
    endingModal.onDidDismiss(response => {
    
      console.log(response)
      if (response && response.type === 'new game') {
        this.startGame();
      } else {
        
        // TODO: Push to other page
      }
    });
    endingModal.present();
  }

  letterClick(letter: Letter) {

    if (this.game.buildWord(letter)) {
      console.log(`Letter ${letter} added!`);
    } else {
      console.log(letter + " can't be added!");
    }
  }

  delete() {
    this.game.currentWord.removeLetter();
  }

  submit() {
    if (this.game.submitWord()) {
      console.log(`Word ${this.game.currentWord} submitted!`)
    } else {
      console.log(this.game.currentWord + " is not valid!")
    }
  }

  shuffle(): void {
    let letters = this.game.getLetterSet().letters;

    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }

    this.rowsAndCols = this.getRowsAndCols(letters);
  }

  definitionToast(word: Word) {
    
    let toast = this.toastCtrl.create({
      message: word.getDefinition(),
      duration: 3000,
      position: "top"
    });
    toast.present(toast);
  }

  useBonus(fab: FabContainer, bonusName: string) {
    this.game.bonusCtrl.apply(bonusName);
    fab.close();
  }

  startLoader(): Promise<void> {
    this.loading = this.loadingController.create({
      content: "Loading..."
    });
    return this.loading.present();
  }

  getRowsAndCols(letters: Letter[]): any {
    return letters.reduce(function (acc: Letter[][], curr: Letter, index: number) {

      if (index % this.rowLength === 0) {
        acc.push([curr]);
      } else {
        acc[acc.length - 1].push(curr);
      }
      return acc;
    }.bind(this), [])
  }

  _str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }

  formatTime(time: number): string {

    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    //return minutes + " : " + seconds;
    return this._str_pad_left(minutes, '0', 1) + ':' + this._str_pad_left(seconds, '0', 2)

  }

  ionViewDidLoad() {
    // this.startGame();
    
    //this.endGame()
  }

  ionViewDidEnter() {

    this.startGame();
  }

}