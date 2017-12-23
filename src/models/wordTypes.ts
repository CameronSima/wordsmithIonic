
const Weights = {
                'A': 0.079971, 'B': 0.020199, 'C': 0.043593,
                'D': 0.032184, 'E': 0.112513, 'F': 0.014622, 
                'G': 0.022845, 'H': 0.023497, 'I': 0.08563,
                'J': 0.001693, 'K': 0.008535, 'L': 0.060585,
                'M': 0.028389, 'N': 0.071596, 'O': 0.065476,
                'P': 0.029165, 'Q': 0.00183,  'R': 0.07264, 
                'S': 0.066044, 'T': 0.070926, 'U': 0.037091, 
                'V': 0.011369, 'W': 0.008899, 'X': 0.002925,
                'Y': 0.024432, 'Z': 0.00335
                };

const Points = {
               'A': 3, 'B': 10, 'C': 7, 'D': 9, 'E': 1,
               'F': 10, 'G': 9, 'H': 9, 'I': 4, 'J': 12,
               'K': 6, 'L': 2, 'M': 9, 'N': 5, 'O': 5, 'P': 9, 
               'Q': 12, 'R': 4, 'S': 6, 'T': 5, 'U': 8, 
               'V': 11, 'W': 11, 'X': 12, 'Y': 10, 'Z': 12 
            }

export class Alphabet {
    values: Letter[];

    constructor() {
        this.values = [];
        this.build();
    }

    // map points to weights
    private build() {
        let index = 0;
        for (const item in Points) {
                console.log(item)
                index++;
                let letter = this.buildLetter(item, index);
                this.values.push(letter);

        }
        console.log(this.values)
    }

    public isVowel(letter: Letter): boolean {
        ['A', 'E', 'I', 'O', 'U'].forEach((vowel) => {
            if (letter.value === vowel) {
                return true;
            }
        });
        return false;
    }

    private buildLetter(value: string, index: number): Letter {
        return {
            value: value,
            id: index,
            points: Points[value], 
            weight: Weights[value]
        }
    }
}


export interface Letter {
    value: string,
    id: number,
    points: number,
    weight: number
}


export class Word {
    private letters: Letter[];

    constructor() {
        this.letters = [];

    }

    // TODO: check word against dictionary
    public isValid(): boolean {
        return true;
    }

    public addLetter(letter: Letter): boolean {
        if (!this.containsLetter(letter)) {
            this.letters.push(letter);
            return true;
        } else {
            return false;
        }
    }

    private containsLetter(letter: Letter): boolean {
        this.letters.forEach((item: Letter) => {
            if (letter.id === item.id) {
                return true;
            }
        });
        return false;
    }
}