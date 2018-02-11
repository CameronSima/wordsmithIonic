import { Component } from '@angular/core';
import { NavParams, IonicPage, ViewController, NavController } from 'ionic-angular';
import { GameResult, Game } from '../../utilities/Game';
// import { Bonus } from '../../models/Bonus';
import LevelConfigs from '../../assets/LevelConfig';
import { LevelConfig } from '../../models/Bonus/Bonus';


// An after-game report.
@IonicPage()
@Component({
  selector: 'game-report',
  templateUrl: 'gameReport.html'
})
export class GameReportPage {
    gameResult: GameResult;
    game: Game;
    progress: any;

    constructor(params: NavParams, public viewCtrl: ViewController, public navCtrl: NavController) {
        this.gameResult = params.get('gameResult');
        this.game = params.get('game');
        this.progress = this.getProgress();
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

      getProgress() {
        let userLevel = this.game.bonusCtrl.UserLevel;
        let nextLevel: LevelConfig;


        for (let level in LevelConfigs) {
          if (LevelConfigs[level].level === userLevel.level + 1) {
            nextLevel = LevelConfigs[level];
          }
        }

        let result = {
          display: `Progress to next level: ${this.formatPoints(this.game.User.gameSettings.points)} / ${this.formatPoints(nextLevel.pointsRequired)}`,
          value: Math.round(this.game.User.gameSettings.points / nextLevel.pointsRequired * 100),
          max: nextLevel.pointsRequired / 1000
        }
        console.log(result)
        return result
      }

      newGame() {
        this.viewCtrl.dismiss({ type: 'new game' });
      }

      dismiss() {
        this.viewCtrl.dismiss({ type: 'welcome page' });
      }

      formatPoints(points: any) {
        if (typeof points === 'string') {
          points = parseInt(points);
        }
        return points.toLocaleString('us-EN');
      }
}