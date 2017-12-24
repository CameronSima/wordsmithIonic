
import { Injectable } from '@angular/core';
import { Letter, Alphabet } from '../models/wordTypes';

@Injectable()
export default class Game {
    User: Object;
    alphabet: Alphabet;
    letterWeightsTotal: number;
    letterSet: Letter[];

    constructor() {

        // TODO: Inject user from storage
        this.User = {gameSettings: {numLetters: 8, vowels: 2}};

        this.alphabet = new Alphabet();
        this.letterWeightsTotal = this.getLetterWeightsTotal();
        this.letterSet = this.generateLetterSet();
    }

    getLetterSet(): Letter[] {
        return this.letterSet;
    }

    private getLetterWeightsTotal() : number {

        let total = 0;
        for (let letter of this.alphabet.values) {
            total += letter.weight
        }
        return total;
    }

    private generateLetterSet(): Letter[] {
        let letters = null;
        let vowelCount = 0;

        while (vowelCount < this.User['gameSettings'].vowels) {
            letters = this.getLetters();
            vowelCount = this.getVowelCount(letters);
        }
        return letters;
    }

    getVowelCount(letters: Letter[]): number {
        let count = 0;

        for (let letter of letters) {
            if (this.alphabet.isVowel(letter)) {
                count += 1;
            }
        }
        return count;
    }

    // Return letterset for a new game, and assign letter ids
    private getLetters(): Letter[] {
        let letters = [];
        let numLetters = this.User['gameSettings'].numLetters;

        for (let i = 0; i < numLetters; i++) {
            let letter = this.getRandomLetter();
            letter.id = i;
            letters.push(letter);
        }
        return letters;
    }

    private getRandomLetter(): Letter {
        let upto = 0;
        let rand = this.getRandomFloat(0, this.letterWeightsTotal, 4);
        
        for (let letter of this.alphabet.values) {
            if (upto + letter.weight > rand) {
                return letter;
            }
            upto += letter.weight;
        }
    }

    private getRandomFloat(min: number, max: number, precision: number): number {
        return parseFloat(
            Math.min(
                min + (Math.random() * (max - min)), max)
            .toFixed(precision));
    }
}