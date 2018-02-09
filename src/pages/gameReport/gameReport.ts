import { Component } from '@angular/core';
import { NavParams, IonicPage, ViewController, NavController } from 'ionic-angular';
import { GameResult, Game } from '../../utilities/Game';
// import { Bonus } from '../../models/Bonus';
import { MainPage, WelcomePage,  } from '../pages';


// An after-game report.
@IonicPage()
@Component({
  selector: 'game-report',
  templateUrl: 'gameReport.html'
})
export class GameReportPage {
    gameResult: GameResult;
    game: Game;

    constructor(params: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.gameResult = params.get('gameResult');
        this.game = params.get('game');
      }

      getHeadingMessage() {
        if (this.gameResult.finalScore > this.game.User.highScore) {
          return "New High Score!"
        } else {
          return "Great Job!"
        }
      }

      getHighestWordString(): string {
        let word = this.gameResult.topWord;
        if (word) {
          return word.toString() + " - "+ word.getScore() + " points";
        } else {
          return "No words submitted!"
        }
      }

      newGame() {
        this.viewCtrl.dismiss({ type: 'new game' });
        //this.navCtrl.push(MainPage);
      }

      dismiss() {
        this.viewCtrl.dismiss({ type: 'welcome page' });
        //this.navCtrl.push(WelcomePage);
      }
}