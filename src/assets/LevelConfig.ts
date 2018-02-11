

let LevelConfig = {
    LEVEL_ONE: {
        level: 1,
        pointsRequired: 0,
        bonuses: []
    },
    LEVEL_TWO: {
        level: 2,
        pointsRequired: 1000000,
        bonuses: [
            {
                name: "WordHintBonus",
                timeAvailable: 10,
            },
            {
                name: "TimeBonus",
                time: 10
            }
        ]
    },
    LEVEL_THREE: {
        level: 3,
        pointsRequired: 2000000,
        bonuses: [
            {
                name: "WordHintBonus",
                timeAvailable: 10,
            },
            {
                name: "TimeBonus",
                time: 20
            },
            {
                name: "ExpandWordListBonus",
            }
        ]
    },
    LEVEL_FOUR: {
        level: 4,
        pointsRequired: 3000000,
        bonuses: [
            {
                name: "WordHintBonus",
            },
            {
                name: "TimeBonus",
                "time": 30
            },
            {
                name: "ExpandWordListBonus",
            },
            {
                name: "WildCardVowelBonus",
            }
        ]
    }
}


export default LevelConfig;
