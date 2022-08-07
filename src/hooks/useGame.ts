import {useEffect, useState} from 'react';
import GameState from "../GameState";
import {ALL, ANSWERS} from "../WordList";
import {NUM_GUESSES} from "../Constants";
import {compareGuess} from "../compareGuess";
import ReactDOM from "react-dom";
import {useLocalStorage} from "./useLocalStorage";
import {getStorageValue, setStorageValue} from "../storage";

export interface Game {
    /**
     * The solution to the game.
     */
    solution: string;
    /**
     * The number of letters in the solution.
     */
    numLetters: number;
    /**
     * The number of guesses the player has.
     */
    numGuesses: number;
    /**
     * A list of submitted guesses.
     */
    submittedGuesses: string[];
    /**
     * The current guess.
     */
    currentGuess: string;
    /**
     * The current state of the game.
     */
    gameState: GameState;
    /**
     * A number array of size [submittedGuesses.length, answerLength] where letterColors[i, j] determines
     * how the jth letter of guess i should be colored. 0 = light gray (unknown), 1 = dark gray
     * (not in answer), 2 = yellow (in answer), 3 = green (in answer and in correct position).
     */
    letterColors: number[][];
    /**
     * Guess feedback for submitted guesses, number array of size [submittedGuesses.length, 2].
     * guessFeedback[i][1] is the number of letters in the answer, and guessFeedback[i][0] is the number
     * of letters in the answer and in the correct spot, for guess i.
     */
    guessFeedback: number[][];
    /**
     * Adds the letter to the current guess
     * @param letter the given alphabetical lowercase letter
     */
    addLetter: (letter: string) => void;
    /**
     * Removes the last letter from the current guess.
     */
    removeLetter: () => void;
    /**
     * Submits the current guess if it is a valid word.
     */
    submitGuess: () => void;
    /**
     * Changes the letter color at the given guess and number locations. Change once from unknown
     * to not in the word, again to in the word, and again to in the correct spot.
     * @param guess which submitted guess (0-indexed) to change.
     * @param pos which letter (0-indexed) in the submitted guess to change.
     */
    changeLetterColor: (guess: number, pos: number) => void;
}

/**
 * A model that keeps track of all game logic.
 * @param day which day's game to play. The state of the game persists if the same
 * day is used twice in a row.
 */
const useGame = (day: number): Game => {
    const [submittedGuesses, setSubmittedGuesses] =
        useLocalStorage<string[]>("submittedGuesses", []);
    const [gameState, setGameState] =
        useLocalStorage<GameState>("gameState", GameState.PLAYING);
    const [letterColors, setLetterColors] =
        useLocalStorage<number[][]>("letterColors", []);
    const [guessFeedback, setGuessFeedback] =
        useLocalStorage<number[][]>("guessFeedback", []);

    const [currentGuess, setCurrentGuess] = useState<string>("");

    const solution = ANSWERS[day];

    const emptyColors: number[] = [];
    for (let i = 0; i < solution.length; i++) {
        emptyColors.push(0);
    }

    // Construct an initial state for guessed letter colors by mapping each alphabetical
    // character to [0,0,...,0].
    const initGuessedLetters: { [key: string]: number[] } = {};
    for (let i = 0; i < 26; i++) {
        let letter: string = String.fromCharCode(97 + i);
        initGuessedLetters[letter] = [...emptyColors];
    }

    // A map of alphabetical characters to how the player thinks they appear in the guess.
    const [guessedLetterColors, setGuessedLetterColors] =
        useLocalStorage<{ [key: string]: number[] }>("guessedLetterColors", initGuessedLetters);

    // If a different day's game is being played, reset all persistent game states.
    useEffect(() => {
        const lastPlayed = getStorageValue<number>("day", 0);
        setStorageValue("day", day);
        if (day !== lastPlayed) {
            ReactDOM.unstable_batchedUpdates(() => {
                setSubmittedGuesses([]);
                setGameState(GameState.PLAYING);
                setLetterColors([]);
                setGuessFeedback([]);
                setGuessedLetterColors(initGuessedLetters);
            });
        }
    }, [day, setGameState, setGuessFeedback, setLetterColors, setSubmittedGuesses, setGuessedLetterColors])

    const addLetter = (letter: string): void => {
        if (gameState !== GameState.PLAYING) return;

        if (currentGuess.length < solution.length) {
            setCurrentGuess(currentGuess + letter);
        }
    }

    const removeLetter = (): void => {
        if (gameState !== GameState.PLAYING) return;

        if (currentGuess.length > 0) {
            setCurrentGuess(currentGuess.slice(0, -1));
        }
    }

    const grayColors: number[] = [];
    for (let i = 0; i < solution.length; i++) {
        grayColors.push(1);
    }

    const submitGuess = (): void => {
        if (gameState !== GameState.PLAYING) return;

        if (currentGuess.length !== solution.length) return;

        if (!ALL.has(currentGuess)) return;

        const newSubmittedGuesses = [...submittedGuesses, currentGuess];

        ReactDOM.unstable_batchedUpdates(() => {
            setSubmittedGuesses(newSubmittedGuesses);
            setCurrentGuess("");
            updateFeedback();

            if (currentGuess === solution) {
                setGameState(GameState.WON);
                revealFeedback(newSubmittedGuesses);
            } else if (submittedGuesses.length + 1 === NUM_GUESSES) {
                setGameState(GameState.LOST);
                revealFeedback(newSubmittedGuesses);
            }
        });
    }

    const updateFeedback = () => {
        const feedback: number[][] = compareGuess(currentGuess, solution);
        setGuessFeedback([...guessFeedback, [feedback[0].length, feedback[1].length]]);

        const newLetterColors: number[] = [...emptyColors];
        for (let i = 0; i < newLetterColors.length; i++) {
            const letter = currentGuess[i];
            newLetterColors[i] = guessedLetterColors[letter][i];
        }

        setLetterColors([...letterColors, newLetterColors]);
    }

    const revealFeedback = (guesses: string[]) => {
        const feedback: number[][] = [];

        for (const guess of guesses) {
            let colors = [...grayColors];

            const currentFeedback: number[][] = compareGuess(guess, solution);

            for (const i of currentFeedback[0]) {
                colors[i] = 3;
            }
            for (const i of currentFeedback[1]) {
                colors[i] = 2;
            }

            feedback.push(colors);
        }

        setLetterColors(feedback);
    }

    const changeLetterColor = (guess: number, pos: number): void => {
        if (gameState !== GameState.PLAYING) return;

        const letter = submittedGuesses[guess][pos];

        const newGuessedLetterColors = {...guessedLetterColors};

        newGuessedLetterColors[letter][pos] += 1;
        newGuessedLetterColors[letter][pos] %= 4;

        if (newGuessedLetterColors[letter][pos] !== 3) {
            for (let i = 0; i < newGuessedLetterColors[letter].length; i++) {
                newGuessedLetterColors[letter][i] = newGuessedLetterColors[letter][pos];
            }
        }

        const newLetterColors = [...letterColors];

        for (let i = 0; i < letterColors.length; i++) {
            for (let j = 0; j < letterColors[0].length; j++) {
                const currentLetter = submittedGuesses[i][j];
                newLetterColors[i][j] = guessedLetterColors[currentLetter][j];
            }
        }

        ReactDOM.unstable_batchedUpdates(() => {
            setGuessedLetterColors(newGuessedLetterColors);
            setLetterColors(newLetterColors);
        });
    }

    const numLetters = solution.length;
    const numGuesses = NUM_GUESSES;
    return {solution, numLetters, numGuesses, submittedGuesses,
        currentGuess, gameState, letterColors, guessFeedback,
        addLetter, removeLetter, submitGuess, changeLetterColor};
}

export default useGame;