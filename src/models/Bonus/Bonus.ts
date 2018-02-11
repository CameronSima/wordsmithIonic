import { Game } from '../../utilities/Game';

export interface LevelConfig {
    level: number,
    pointsRequired: number,
    bonuses: BonusConfig[]
}

export interface BonusConfig {
    name: string,
    time?: number,
    level?: number,
    timeAvailable?: number,
    nextLevel?: LevelConfig
}

export enum BonusTypes {
    WORD_HINT = "WordHintBonus",
    TIME = "TimeBonus",
    EXPAND_WORD_LIST = "ExpandWordListBonus",
    WILD_CARD_VOWEL = "WildCardVowelBonus"
}

export abstract class Bonus {

    game: Game;
    public config: BonusConfig;
    private wasUsed: boolean;

    // Return promise when Bonus has expired
    public abstract deploy(): Promise<any>;

    // Defines the conditions under which the bonus is to be considered executed.
    public abstract wasExecuted(): boolean;

    // Function to run if the bonus was executed.
    public abstract onExecution(): void;

    constructor(game: Game, config: BonusConfig) {
        this.game = game;
        this.config = config;
        this.wasUsed = false;
    }

    apply(): void {
        console.log("BONUS IS VALIUD")
        console.log(this.isValid())
        if(this.isValid()) {
            this.wasUsed = true;
            this.deploy();
        }
    }


    public getWasUsed(): boolean {
        return this.wasUsed;
    }

    public getLevel(): number {
        return this.config.level;
    }

    isValid(): boolean {
        return this.wasUsed === false;
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
