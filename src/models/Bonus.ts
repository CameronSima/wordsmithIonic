import { Game } from '../utilities/Game';
import { Word } from './wordTypes';
import Levels from '../assets/LevelConfig';

interface BonusConfig {
    name: string,
    number: number,
    time?: number,
    level: number
}

export class BonusController {

    private bonuses: Bonus[];
    private game: Game;
    private userLevel: number;

    public constructor(game: Game) {
        this.game = game;
        this.userLevel = game.User.gameSettings.level;
        this.bonuses = [];
        this.populate();
    }

    public apply(bonusName: string) {

        console.log("APPLIED")
        console.log(bonusName)

        console.log(this.getBonus(bonusName))
        this.getBonus(bonusName).apply();
    }

    public 

    private populate(): void {
        let bonusConfigs: BonusConfig[] = Levels[this.userLevel].bonuses;

        bonusConfigs.forEach((config: BonusConfig) => {
            let bonus: Bonus = this.buildBonus(config);
            if (bonus) {
                this.bonuses.push(bonus);
            }
        });
    }

    private buildBonus(config: BonusConfig): Bonus {

        switch(config.name) {

            case "WordHintBonus" : {
                return new WordHintBonus(this.game, config);
            }

            case "TimeBonus" : {
                return new TimeBonus(this.game, config);
            }

            default : {
                return null;
            }
        }
    }

    public getBonus(bonusName: string): Bonus {
        let bonus: Bonus;
        this.bonuses.forEach((b) => {
            if (b.getName() === bonusName) {
                bonus = b;
            }
        });
        return bonus;
    }

    public getBonuses(): Bonus[] {
        return this.bonuses;
    }
}

export abstract class Bonus {

    game: Game;
    public config: BonusConfig;
    private timesUsed: number;
    public abstract use(): void;

    constructor(game: Game, config: BonusConfig) {
        this.game = game;
        this.config = config;
    }

    apply(): void {

        console.log(this.isValid())
        if(this.isValid()) {
            this.config.number--;
            this.timesUsed++;
            this.use();
        }
    }

    isValid(): boolean {
        return this.config.number > 0;
    }

    getNumberAvailable(): number {
        return this.config.number;
    }

    getTimesUsed(): number {
        return this.timesUsed;
    }

    getName(): string {
        return this.constructor.name;
    }

    toString(): string {
        return this.getName();
    }

    pickRandomProperty(obj: Object) {
        let result;
        let count = 0;
        for (let prop in obj) {
            if (Math.random() < 1 / ++count) {
                result = prop;
            }
        }
        return result;
    }
}

export class TimeBonus extends Bonus {

    constructor(game: Game, config: BonusConfig) {
        super(game, config);
    }

    use() {
        this.game.timeLeft += this.config.time;
    }
}

export class WordHintBonus extends Bonus {

    hintWord: Word;
 
    constructor(game: Game, config: BonusConfig) {
        super(game, config);
        this.hintWord = this.getHintWord();
    }

    public use() {
        
    }

    private getHintWord(): Word {
        let availableWords = this.game.getAllPossibleWords();
        let wordStr: string = this.pickRandomProperty(availableWords);
        let word: Word = new Word().fromString(wordStr);
        let definitions: string[] = availableWords[wordStr];
        word.setDefinitions(definitions);
        return word;
    }
}