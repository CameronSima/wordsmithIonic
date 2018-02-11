
import { Injectable } from '@angular/core';
import { Word, Letter } from '../models/wordTypes';
import User from '../models/User';
import Dictionary from './Dictionary'
import LetterSet from './LetterSet';
import { Bonus } from '../models/Bonus/Bonus';
import { BonusController } from '../models/Bonus/BonusController';

export interface GameResult {
    finalScore: number,
    gameScore: number,
    bonusesUsed: Bonus[],
    timeBonus: number,
    unusedBonusBonus: number,
    topWord: Word
}

@Injectable()
export class Game {

    // A reference to list-master.ts page to pass to BonusCtrl to display bonus info.
    UiCtrl: any;
    bonusCtrl: BonusController;
    User: User;
    letterSet: LetterSet;
    wordList: Word[];
    currentWord: Word;
    allPossibleWords: Object;
    public timeLeft: number;
    onGameEnd: Function;

    constructor() {
        
        // TODO: Inject user from storage
        this.User = { highScore: 10000, gameSettings: { numLetters: 10, vowels: 2, level: 2, numWords: 8, gameTime: 30, points: 1100000 } };
        this.setDefaults();
    }

    init(dictionary: Dictionary, UiContrl: any) {
        this.letterSet = new LetterSet(this.User['gameSettings'].numLetters, this.User['gameSettings'].vowels);
        this.UiCtrl = UiContrl;
        this.addAllPossibleWords(dictionary);
        this.bonusCtrl = new BonusController(this);

        console.log("Game Initialized");
    }

    public start(callback: Function) {
        //this.setDefaults();
        this.startTimer(() => {
            let result: GameResult = this.getGameResult();
            this.setDefaults();
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
            this.timeLeft--;
        }, 1000)
    }

    private setDefaults(): void {
        this.timeLeft = this.User.gameSettings.gameTime;
        this.wordList = [];
        this.allPossibleWords = {};
        this.currentWord = new Word();
    }

    public addAllPossibleWords(dictionary: Dictionary): void {
        let entries = dictionary.entries;

        for (let category in entries) {
            let words = entries[category];

            for (let word in words) {
                if (word.length > 2 && this.canBuildWord(word)) {
                    this.allPossibleWords[word] = words[word]
                }
            }
        }

        console.log("ALL POSIBLE")
        console.log(this.allPossibleWords)
    }

    public getAllPossibleWords(): Object {
        return this.allPossibleWords;
    }

    public buildWord(letter: Letter): boolean {
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
        });
        return result;
    }

    public getScore(): number {
        let score: number = 0;

        this.wordList.forEach((word) => {
            score += word.getScore();
        })
        return score;
    }

    public getLetterSet(): LetterSet {
        return this.letterSet;
    }

    public setLetterSet(letterSet: LetterSet): void {
        this.letterSet = letterSet;
    }

    public getWordList(): Word[] {
        return this.wordList;
    }

    public submitWord(): boolean {
        let added: boolean;
        let word = this.currentWord;

        if (word.getLetters().length > 2 && !this.existsInWordList(word) && this.addedToList(word)) {

            this.bonusCtrl.checkExecution();

            // Limit wordlist to number of allowed words, and also sort for display in ui
            this.wordList = this.sorted(this.wordList).slice(0, this.User['gameSettings'].numWords);
            added = true;
        } else {
            added = false;
        }
        this.resetCurrentWord();
        return added;
    }

    private resetCurrentWord(): void {
        this.currentWord.unselectedAll();
        this.currentWord = new Word();
    }

    // add to work list and return true if successfully added
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

    public existsInWordList(word: Word) {
        let alreadyAdded: boolean = false;

        this.wordList.forEach((w) => {
            if (w.equals(word)) {
                alreadyAdded = true;
            }
        })
        return alreadyAdded;
    }

    private getGameResult(): GameResult {
        let gameScore: number = this.getScore();
        let bonusesUsed: Bonus[] = this.getBonusesUsed();
        let topWord: Word = this.getHighestWord();
        let timeBonus: number = this.getTimeBonus();
        let unusedBonusBonus: number = this.getUnnusedBonusBonus();
        let finalScore: number = gameScore + unusedBonusBonus + timeBonus

        return {
            finalScore: finalScore,
            gameScore: gameScore,
            bonusesUsed: bonusesUsed,
            timeBonus: timeBonus,
            unusedBonusBonus: unusedBonusBonus,
            topWord: topWord
        }
    }

    private getBonusesUsed(): Bonus[] {
        return this.bonusCtrl.getBonuses().filter((bonus) => {
            return bonus.getWasUsed();
        })
    }


    getTimeBonus(): number {

        // TODO: refine time bonus
        return this.timeLeft * 1000;
    }

    getUnnusedBonusBonus(): number {
        let points = 0;
        this.bonusCtrl.getBonuses().forEach((bonus: Bonus) => {
            if (bonus.getWasUsed() === false) {
                points += 10000 * bonus.config.level;
            }
        });
        return points;
    }

    getHighestWord(): Word {
        let wordList = this.getWordList();

        if (wordList.length === 0) {
            return null;
        } else if (wordList.length === 1) {
            return wordList[0];
        } else {
            return this.getWordList().reduce((curr: Word, next: Word) => {
                if (curr.getScore() > next.getScore()) {
                    return curr;
                } else {
                    return next;
                }
            });
        }
    }
}
