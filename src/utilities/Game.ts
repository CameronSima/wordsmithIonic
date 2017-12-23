
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

        console.log(this.alphabet.values)
    
        let total = 0;
        for (let letter of this.alphabet.values) {
            console.log(total)
            total += letter.weight
        }
        console.log(total)
        return total;
    }

    private generateLetterSet(): Letter[] {
        const letters = this.getLetters();
        console.log(letters)
        const vowelCount = this.getVowelCount(letters);
        
        if (vowelCount < this.User['gameSettings'].vowels) {
            this.generateLetterSet();
        } else {
            return letters;
        }
    }

    getVowelCount(letters: Letter[]): number {
        let count = 0;

        console.log(letters)

        for (let letter of letters) {
            console.log(letter)
            if (this.alphabet.isVowel(letter)) {
                count++;
            }
        }
        return count;
    }

    private getLetters(): Letter[] {
        let letters = [];
        let numLetters = this.User['gameSettings'].numLetters;

        for (let i = 0; i < numLetters; i++) {
            console.log(this.getRandomLetter())
            letters.push(this.getRandomLetter());
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