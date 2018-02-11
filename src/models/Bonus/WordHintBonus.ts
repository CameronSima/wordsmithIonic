import { Game } from '../../utilities/Game';
import { Bonus, BonusConfig } from './Bonus';
import { Word } from '../wordTypes';

export class WordHintBonus extends Bonus {

    hintWord: Word;
 
    constructor(game: Game, config: BonusConfig) {
        super(game, config);
        this.hintWord = this.getHintWord();
    }

    public deploy(): Promise<any> {
        let toast = this.game.UiCtrl.toastCtrl.create({
            message: this.hintWord.getDefinition(),
            duration: 3000,
            position: "top"
          });
          return toast.present(toast);
    }

    public wasExecuted(): boolean {
        let currentWord = this.game.currentWord;
        console.log("HOINT WORD")
        console.log(this.hintWord)
        console.log("WAS EXECUTED:  " + currentWord.equals(this.hintWord))

        console.log(currentWord)

        return currentWord.equals(this.hintWord);
    }

    public onExecution(): void {
        let toast = this.game.UiCtrl.toastCtrl.create({
            message: "Great Job!",
            duration: 1500,
            position: "top"
          });
          toast.present(toast);
    }

    private getHintWord(): Word {
        let availableWords = this.game.getAllPossibleWords();
        let wordStr: string = this.pickRandomProperty(availableWords);
        let word: Word = new Word().fromString(wordStr);

        while (this.game.existsInWordList(word)) {
            wordStr = this.pickRandomProperty(availableWords);
            word = new Word().fromString(wordStr);
        }
        console.log(word.toString())
        let definitions: string[] = availableWords[wordStr];
        word.setDefinitions(definitions);
        return word;
    }
}