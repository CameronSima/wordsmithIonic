let Game = require('../src/utilities/Game.ts');
let Bonus = require('../src/models/Bonus/Bonus');
let BonusController = require('..src/models/Bonus/BonusController');
//import 'reflect-metadata';
//import { Letter, Word } from '../src/models/wordTypes';
let game;
let bonusCtrl;

beforeEach(() => {
    game = new Game.default();
    bonusCtrl = new BonusController(game);
})

describe('Game tests', function() {
    it('should create a letterset', function() {
        expect(1).toEqual(1);
    })

   
})