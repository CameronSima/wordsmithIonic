export default interface User {
    gameSettings: {
        numLetters: number, 
        vowels: number, 
        level: number,
        numWords: number,
        gameTime: number,
        points: number
    },
    highScore?: number
};
