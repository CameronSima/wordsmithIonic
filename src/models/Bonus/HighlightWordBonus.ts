import { Game } from '../../utilities/Game';
import { Bonus, BonusConfig } from './Bonus';
import { WordHintBonus } from './WordHintBonus';
import { Letter, Word } from '../wordTypes';

export default class HighlightWordBonus extends WordHintBonus {

    wordHint: Word;

    constructor(game: Game, config: BonusConfig) {
        super(game, config);
    }

    public deploy() {
        this.highlightLetters();
        return new Promise<any>((resolve, reject) => {});
    }

    public onExecution(): void {
        let message = this.hintWord.toString() + ": " + this.hintWord.getDefinition();
        let toast = this.game.UiCtrl.toastCtrl.create({
            message: message,
            duration: 1500,
            position: "top"
          });
          toast.present(toast);
    }

    private highlightLetters(): void {
        let letterSet: Letter[] = this.game.getLetterSet().letters;

        letterSet.forEach((letter: Letter) => {
          this.highlightHintLetter(letter);
        })



    }

    private highlightHintLetter(letter: Letter): void {

        if (letter.highlighted) {
            return;
        } else {
            let hintWordLetters: Letter[] = this.wordHint.getLetters();
            let lettToHighlight = hintWordLetters.find((hintLetter) => {
                return hintLetter.value === letter.value;
            });

            if (lettToHighlight) {
                letter.highlighted = true;
            }
        }

    }
}