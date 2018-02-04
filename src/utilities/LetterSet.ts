import { Letter, Alphabet } from '../models/wordTypes';

export default class LetterSet {

    letters: Letter[];
    letterWeightsTotal: number;
    alphabet: Alphabet;
    numLetters: number;
    numVowels: number;

    constructor(numLetters: number, numVowels: number, letters?: Letter[]) {
        this.alphabet = Alphabet.Instance;
        this.numLetters = numLetters;
        this.numVowels = numVowels;
        this.letterWeightsTotal = this.getLetterWeightsTotal();

        this.letters = letters ?
            letters : this.generateLetterSet();
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

        while (vowelCount !== this.numVowels) {
            letters = this.getLetters();
            vowelCount = this.getVowelCount(letters);
        }
        return letters;
    }

    private getVowelCount(letters: Letter[]): number {
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

        for (let i = 0; i < this.numLetters; i++) {
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

                return {
                    value: letter.value,
                    points: letter.points,
                    selected: false
                };
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