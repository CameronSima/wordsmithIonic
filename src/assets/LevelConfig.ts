

let LevelConfig = {
    LEVEL_ONE: {
        pointsRequired: 0,
        bonuses: []
    },
    LEVEL_TWO: {
        pointsRequired: 1000000,
        bonuses: [
            {
                name: "WordHintBonus",
                number: 1
            },
            {
                name: "TimeBonus",
                number: 1,
                time: 10
            }
        ]
    },
    LEVEL_THREE: {
        pointsRequired: 2000000,
        bonuses: [
            {
                level: 3,
                name: "WordHintBonus",
                number: 1
            },
            {
                level: 3,
                name: "TimeBonus",
                number: 1,
                time: 20
            },
            {
                level: 3,
                name: "ExpandWordListBonus",
                number: 1
            }
        ]
    },
    LEVEL_FOUR: {
        pointsRequired: 3000000,
        bonuses: [
            {
                level: 4,
                name: "WordHintBonus",
                number: 1
            },
            {
                level: 4,
                name: "TimeBonus",
                number: 1,
                "time": 30
            },
            {
                level: 4,
                name: "ExpandWordListBonus",
                number: 1
            },
            {
                level: 4,
                name: "WildCardVowelBonus",
                number: 1
            }
        ]
    }
}


export default LevelConfig;
