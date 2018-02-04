const Weights = {
    'A': 0.079971, 'B': 0.020199, 'C': 0.043593,
    'D': 0.032184, 'E': 0.112513, 'F': 0.014622,
    'G': 0.022845, 'H': 0.023497, 'I': 0.08563,
    'J': 0.001693, 'K': 0.008535, 'L': 0.060585,
    'M': 0.028389, 'N': 0.071596, 'O': 0.065476,
    'P': 0.029165, 'Q': 0.00183, 'R': 0.07264,
    'S': 0.066044, 'T': 0.070926, 'U': 0.037091,
    'V': 0.011369, 'W': 0.008899, 'X': 0.002925,
    'Y': 0.024432, 'Z': 0.00335
};

export const ScrabblePoints = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1,
    'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
    'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3,
    'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1,
    'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
}

export const Points = {
    'A': 3, 'B': 10, 'C': 7, 'D': 9, 'E': 1,
    'F': 10, 'G': 9, 'H': 9, 'I': 4, 'J': 12,
    'K': 6, 'L': 2, 'M': 9, 'N': 5, 'O': 5, 'P': 9,
    'Q': 12, 'R': 4, 'S': 6, 'T': 5, 'U': 8,
    'V': 11, 'W': 11, 'X': 12, 'Y': 10, 'Z': 12
}


const formulas = {
    1: [1, 0],
    2: [20, 2e3],
    3: [70, 7e3],
    4: [80, 8e3],
    5: [100, 1e4],
    6: [120, 12e3],
    7: [140, 15e3],
    8: [180, 2e4],
    9: [220, 25e3],
    10: [260, 3e4],
    11: [350, 4e4],
    12: [440, 5e4]
}

export class Alphabet {

    private static instance: Alphabet;
    public values: Letter[];
    
    private constructor() {
        this.values = [];
        this.build();
    }

    public static get Instance() {
        return this.instance || (this.instance = new this())
    }

    // map points to weights
    private build() {
        for (const item in Points) {
            let letter = this.buildLetter(item);
            this.values.push(letter);
        }
    }

    public isVowel(letter: Letter): boolean {
        let isVowel = false;

        ['A', 'E', 'I', 'O', 'U'].forEach((vowel) => {
            if (letter.value === vowel) {
                isVowel = true;
            }
        });
        return isVowel;
    }

    public buildLetter(value: string): Letter {

        // Leave index null at this point; ids will be assigned
        // when letterset is built.
        return {
            value: value.toUpperCase(),
            id: null,
            points: Points[value],
            weight: Weights[value],
            selected: false
        }
    }
}

export interface Letter {
    value: string,
    id?: number,
    points: number,
    weight?: number,
    selected: boolean,
}

export class Word {
    private letters: Letter[];
    private definitions: Array<string>;
    private score: number;
    private alphabet;

    constructor() {
        this.letters = [];
        this.score = null;
        this.alphabet = Alphabet.Instance;
    }

    setDefinitions(definition: Array<string>) {
        this.definitions = definition;
    }

    getDefinitions(): Array<string> {
        return this.definitions;
    }

    public getScore() {

        if (!this.score) {
            let sum: number = 0;
            this.letters.forEach((letter) => {
                sum += letter.points;
            });

            let len = this.letters.length;
            this.score = formulas[len][0] * sum + formulas[len][1];
        }
        return this.score;
    }

    public equals(word: Word): boolean {
        return word.toString() === this.letters.map((lett) => lett.value.toUpperCase()).join("");
    }

    public toString(): string {
        return this.letters.reduce((acc, curr) => {
            return acc + curr.value
        }, "")
    }

    public fromString(str: string): Word {
        let letters: Letter[] = str.split('').map(el => {
            return this.alphabet.buildLetter(el);
        });
        this.setLetters(letters);
        return this;
    }

    public getLetters(): Letter[] {
        return this.letters;
    }

    public setLetters(letters: Letter[]) {
        this.letters = letters;
    }

    public addLetter(letter: Letter): boolean {
        if (!this.containsLetter(letter)) {
            letter.selected = true;
            this.letters.push(letter);
            return true;
        } else {
            return false;
        }
    }

    public removeLetter(): void {
        if (this.letters.length > 0) {
            let unselected = this.letters.pop();
            unselected.selected = false;
        }
    }

    private containsLetter(letter: Letter): boolean {
        let alreadyUsed: boolean = false;

        this.letters.forEach((item: Letter) => {
            if (letter.id === item.id) {
                alreadyUsed = true;
            }
        });
        return alreadyUsed;
    }

    public unselectedAll(): void {
        this.letters.forEach((letter) => {
            letter.selected = false;
        })
    }
}
