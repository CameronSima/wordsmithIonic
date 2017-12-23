import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';
import Game from '../../utilities/Game';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { Word, Letter } from '../../models/wordTypes';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  letters: Letter[];
  rowLength: number;
  rowsAndCols: string[][];
  word: Word;

  constructor(public navCtrl: NavController, public game: Game, public items: Items, public modalCtrl: ModalController) {
    this.currentItems = this.items.query();
    this.letters = game.getLetterSet();
    this.rowLength = 4;
    this.rowsAndCols = this.getRowsAndCols();
    this.word = null;
  }

  getRowsAndCols(): any {
    return this.letters.reduce(function(acc: Letter[][], curr: Letter, index: number) {

      if (index % this.rowLength === 0) {
        acc.push([curr]);
      } else {
        acc[acc.length-1].push(curr);
      }
      return acc;
    }.bind(this), [])
  }

  ionViewDidLoad() {
  }

}