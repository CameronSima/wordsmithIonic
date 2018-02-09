
import { Injectable } from '@angular/core';
import { Word, Letter } from '../models/wordTypes';
import User from '../models/User';
import Dictionary from './Dictionary'
import LetterSet from './LetterSet';
import { Bonus, BonusController } from '../models/Bonus';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

export interface GameResult {
    finalScore: number,
    bonusesUsed: Bonus[],
    timeBonus: number,
    unusedBonusBonus: number,
    topWord: Word
}

@Injectable()
export class Game {
    bonusCtrl: BonusController;
    modalCtrl: ModalController;
    User: User;
    letterSet: LetterSet;
    wordList: Word[];
    currentWord: Word;
    allPossibleWords: Object;
    public timeLeft: number;
    onGameEnd: Function;

    constructor() {
        
        // TODO: Inject user from storage
        this.User = { highScore: 10000, gameSettings: { numLetters: 10, vowels: 2, level: 2, numWords: 8, gameTime: 1, points: 1000000 } };
        this.setDefaults();
    }

    init(dictionary: Dictionary, modalCtrl: ModalController) {
        this.modalCtrl = modalCtrl;
        this.letterSet = new LetterSet(this.User['gameSettings'].numLetters, this.User['gameSettings'].vowels);
        
        this.addAllPossibleWords(dictionary, () => {
            this.bonusCtrl = new BonusController(this);
        });

        console.log("Game Initialized");
    }

    public start(callback: Function) {
        this.setDefaults();
        this.startTimer(() => {
            let result: GameResult = this.getGameResult();
            callback(result);
        })
    }


    public startTimer(callback: Function): void {
        let timer = setInterval(() => {
            if (this.timeLeft === 0) {
                //this.endGame();
                clearInterval(timer);
                callback();
            }
            console.log(this.timeLeft)
            this.timeLeft--;
        }, 1000)
    }

    private setDefaults(): void {
        this.timeLeft = this.User.gameSettings.gameTime;
        this.wordList = [];
        this.allPossibleWords = {};
        this.currentWord = new Word();
    }

    public addAllPossibleWords(dictionary: Dictionary, callback: Function): void {
        let entries = dictionary.entries;

        for (let category in entries) {
            let words = entries[category];

            for (let word in words) {
                if (word.length > 2 && this.canBuildWord(word)) {
                    this.allPossibleWords[word] = words[word]
                }
            }
        }
        callback();
    }

    public getAllPossibleWords(): Object {
        return this.allPossibleWords;
    }

    buildWord(letter: Letter): boolean {
        if (this.currentWord.addLetter(letter)) {
            return true;
        } else {
            return false;
        }
    }

    public canBuildWord(word: string): boolean {

        let result: boolean = true;
        let letts: string[] = word.split("").map(lett => lett.toUpperCase())
        let availableLetts: string[] = this.letterSet.letters.map(letter => letter.value)

        letts.forEach((lett) => {
            let index: number = availableLetts.indexOf(lett);

            if (index > -1) {
                availableLetts.splice(index, 1);
            } else {
                result = false;
            }
        })
        return result;
    }

    getScore(): number {
        let score: number = 0;

        this.wordList.forEach((word) => {
            score += word.getScore();
        })
        return score;
    }

    getLetterSet(): LetterSet {
        return this.letterSet;
    }

    setLetterSet(letterSet: LetterSet): void {
        this.letterSet = letterSet;
    }

    getWordList(): Word[] {
        return this.wordList;
    }

    submitWord(): boolean {
        let added: boolean;
        let word = this.currentWord;
        this.currentWord = new Word();
        word.unselectedAll();

        if (word.getLetters().length > 2 && !this.existsInWordList(word) && this.addedToList(word)) {

            // Limit wordlist to number of allowed words, and also sort for display in ui
            this.wordList = this.sorted(this.wordList).slice(0, this.User['gameSettings'].numWords);
            added = true;
        } else {
            added = false;
        }
        return added;
    }

    private addedToList(word: Word): boolean {
        let definitions: Array<string> = this.allPossibleWords[word.toString()];
        if (definitions !== undefined) {
            word.setDefinitions(definitions);
            this.wordList.push(word);
            return true;
        } else {
            return false;
        }
    }

    sorted(wordList: Word[]): Word[] {
        return wordList.sort((a: Word, b: Word) => {
            if (a.getScore() > b.getScore()) {
                return -1
            } else if (a.getScore() < b.getScore()) {
                return 1;
            } else {
                return 0;
            }
        })
    }

    private existsInWordList(word: Word) {

        let alreadyAdded: boolean = false;

        this.wordList.forEach((w) => {
            if (w.equals(word)) {
                alreadyAdded = true;
            }
        })
        return alreadyAdded;
    }

    getGameResult(): GameResult {
        let finalScore = this.getScore();
        let bonusesUsed: Bonus[] = this.getBonusesUsed(this.bonusCtrl);
        let topWord: Word = this.getHighestWord();
        let timeBonus = this.getTimeBonus();
        let unusedBonusBonus = this.getUnnusedBonusBonus(this.bonusCtrl);

        return {
            finalScore: finalScore,
            bonusesUsed: bonusesUsed,
            timeBonus: timeBonus,
            unusedBonusBonus: unusedBonusBonus,
            topWord: topWord
        }
    }

    getBonusesUsed(bonusCtrl: BonusController) {
        let used: Bonus[];

        bonusCtrl.getBonuses().filter((bonus: Bonus) => {
            return bonus.getTimesUsed() > 0;
        });
        return used;
    }

    getTimeBonus(): number {

        // TODO: refine time bonus
        return this.timeLeft * 1000;
    }

    getUnnusedBonusBonus(bonusCtrl: BonusController): number {
        let points = 0;
        bonusCtrl.getBonuses().forEach((bonus: Bonus) => {
            points += bonus.getNumberAvailable() * bonus.config.level;
        });
        return points;
    }

    getHighestWord(): Word {
        return this.getWordList().reduce((curr: Word, next: Word) => {
            if (curr.getScore() > next.getScore()) {
                return curr;
            } else {
                return next;
            }
        }, null);
    }

    // public endGame() {
    //     let result: GameResult = this.getGameResult();
    //     let endingModal = this.modalCtrl.create('GameReportPage', { gameReport: result, game: this });
    //     endingModal.present();
    // }
}
