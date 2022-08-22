
// The number of guesses the player has
export const NUM_GUESSES: number = 10;
export const DISPLAY_LETTERS: string[] = [
    "tile-gray", "tile-dark-gray", "tile-yellow", "tile-green"
]

export const SHARE_LETTERS: string[] = [
    "⬜", "🟨", "🟩"
]

export const START_DATE: Date = new Date(2022, 7, 6);

/**
 * The version of the game rules (not necessarily the web app). A different game rule
 * version will trigger a reset of local storage and the game.
 */
export const GAME_RULE_VERSION: string = "1";