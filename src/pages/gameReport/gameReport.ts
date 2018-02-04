import { Component } from '@angular/core';
import { NavParams, IonicPage, ViewController } from 'ionic-angular';
import { GameResult, Game } from '../../utilities/Game';
import { Word } from '../../models/wordTypes';
import { Bonus } from '../../models/Bonus';


// An after-game report.
@IonicPage()
@Component({
  selector: 'game-report',
  templateUrl: 'gameReport.html'
})
export class GameReportPage {
    gameResult: GameResult;
    game: Game;

    constructor(params: NavParams, public viewCtrl: ViewController) {
        this.gameResult = params.get('gameReport');
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

      dismiss() {
        this.viewCtrl.dismiss();
      }
}