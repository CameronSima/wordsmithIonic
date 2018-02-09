import { Game } from '../utilities/Game';
import { Word } from './wordTypes';
import LevelConfigs from '../assets/LevelConfig';
import User from '../models/User';

interface LevelConfig {
    pointsRequired: number,
    bonuses: BonusConfig[]
}

interface BonusConfig {
    name: string,
    number: number,
    time?: number,
}

export enum BonusTypes {
    WORD_HINT = "WordHintBonus",
    TIME = "TimeBonus",
    EXPAND_WORD_LIST = "ExpandWordListBonus",
    WILD_CARD_VOWEL = "WildCardVowelBonus"
}

export class BonusController {

    private bonuses: Bonus[];
    private game: Game;
    private userLevel: number;
    private User: User;

    public constructor(game: Game) {
        this.game = game;
        this.User = game.User;
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

    private populate(): void {
        let bonusConfigs: BonusConfig[] = this.getUserLevel().bonuses;

        bonusConfigs.forEach((config: BonusConfig) => {
            let bonus: Bonus = this.buildBonus(config);
            if (bonus) {
                this.bonuses.push(bonus);
            }
        });
    }

    private getUserLevel(): LevelConfig {
        let userPoints: number = this.User.gameSettings.points;
        let userConfig: LevelConfig;

        for (let level in LevelConfigs) {
            if (userPoints >= LevelConfigs[level].pointsRequired) {
                userConfig = LevelConfigs[level];
                break;
            }
        }
        return userConfig;
    }

    private buildBonus(config: BonusConfig): Bonus {

        switch(config.name) {

            case BonusTypes.WORD_HINT : {
                return new WordHintBonus(this.game, config);
            }

            case BonusTypes.TIME : {
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