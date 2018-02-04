let Game = require('../src/utilities/Game.ts');
//import 'reflect-metadata';
//import { Letter, Word } from '../src/models/wordTypes';
let game;

beforeEach(() => {
    game = new Game.default();
})

describe('Game tests', function() {
    it('should create a letterset', function() {
        expect(1).toEqual(1);
    })

    it('can test if a word can be build from the letterset', () => {
        let word1 = "Actor";
        let word2 = "Core";
        let word3 = "Actaa";
        let word4 = "Act._-"
        let letterset = [{value: 'A'}, {value: 'A'}, {value: 'C'}, {value: 'T'}, {value: 'O'}, {value: 'R'}, {value: 'S'}];
        game.setLetterSet(letterset);

        expect(game.canBuildWord(word1)).toBe(true);
        expect(game.canBuildWord(word2)).toBe(false);
        expect(game.canBuildWord(word3)).toBe(false);
        expect(game.canBuildWord(word4)).toBe(true);

    })
})