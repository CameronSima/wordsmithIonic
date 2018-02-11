import { Bonus, BonusConfig, BonusTypes, LevelConfig } from './Bonus';
import { WordHintBonus } from './WordHintBonus';
import { TimeBonus } from './TimeBonus';
import { Game } from '../../utilities/Game';
import User from '../User';
import LevelConfigs from '../../assets/LevelConfig';
import { Button } from 'ionic-angular/components/button/button';


export class BonusController {

    private bonuses: Bonus[];
    private game: Game;
    private User: User;
    public UserLevel: LevelConfig;
    private currentBonus: Bonus;

    public constructor(game: Game) {
        this.game = game;
        this.User = game.User;
        this.bonuses = [];
        this.UserLevel = this.getUserLevel();
        this.populate();
    }

    public checkExecution(): void {
        if (this.currentBonus && this.currentBonus.wasExecuted()) {
            this.currentBonus.onExecution();
        }
    }
    public apply(bonusName: string) {

        console.log("APPLIED")
        let currentBonus = this.getBonus(bonusName);
        this.currentBonus = currentBonus;
        console.log(currentBonus);
        this.currentBonus.apply();
    }

    private populate(): void {
        let bonusConfigs: BonusConfig[] = this.UserLevel.bonuses;
        let level = this.UserLevel.level;

        bonusConfigs.forEach((config: BonusConfig, index: number) => {
            config.level = level;
            let bonus: Bonus = this.buildBonus(config, level);
            if (bonus) {
                this.bonuses.push(bonus);
            }
        });
    }

    private getUserLevel(): LevelConfig {
        let userPoints: number = this.User.gameSettings.points;
        let configsArr: LevelConfig[] = [];

        for (let level in LevelConfigs) {
            configsArr.push(LevelConfigs[level]);
 
            }
        configsArr.reverse();
        let userConfig: LevelConfig = configsArr.find((config) => userPoints >= config.pointsRequired)
        return userConfig;
    }

    private buildBonus(config: BonusConfig, level: number): Bonus {

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