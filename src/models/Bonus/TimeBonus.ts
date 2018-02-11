import { Game } from '../../utilities/Game';
import { Bonus, BonusConfig } from './Bonus';

export class TimeBonus extends Bonus {

    constructor(game: Game, config: BonusConfig) {
        super(game, config);
    }

    public deploy(): Promise<any> {
        this.game.timeLeft += this.config.time;
        return new Promise<any>((resolve, reject)=> {});
    }

    public onExecution(): void {
        return;
    }

    // Executed by default
    public wasExecuted(): boolean {
        return true;
    }
}