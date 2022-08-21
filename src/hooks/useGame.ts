import {useEffect, useMemo, useState} from 'react';
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
     * True when a word not in the list is submitted.
     */
    invalidWord: boolean;
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
    /**
     * Clears all letter colors that the player has guessed, resets all letter colors to unknown.
     */
    clearLetterColors: () => void;
}

interface LetterInfo {
    known: boolean;
    letterCount: number;
    correctPositions: number[];
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
    const [invalidWord, setInvalidWord] = useState<boolean>(false);

    const solution = useMemo(() => ANSWERS[day % ANSWERS.length], [day]);

    const emptyColors = useMemo(() => {
        const res: number[] = [];
        for (let i = 0; i < solution.length; i++) {
            res.push(0);
        }
        return res;
    }, [solution]);

    const grayColors = useMemo(() => {
        const res: number[] = [];
        for (let i = 0; i < solution.length; i++) {
            res.push(1);
        }
        return res;
    }, [solution]);

    // Construct an initial state for guessed letter colors by mapping each alphabetical
    // character to the default (unknown) colors.
    const initGuessedLetters = useMemo(() => {
        const res: { [key: string]: LetterInfo } = {};
        for (let i = 0; i < 26; i++) {
            let letter: string = String.fromCharCode(97 + i);
            res[letter] = { known: false, letterCount: 0, correctPositions: [] };
        }
        return res;
    }, [])

    // A map of alphabetical characters to how the player thinks they appear in the guess.
    const [guessedLetterColors, setGuessedLetterColors] =
        useLocalStorage<{ [key: string]: LetterInfo }>("guessedLetterColors",
            JSON.parse(JSON.stringify(initGuessedLetters)));

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
                setGuessedLetterColors(JSON.parse(JSON.stringify(initGuessedLetters)));
            });
        }
    }, [day, initGuessedLetters, setGameState, setGuessFeedback,
        setLetterColors, setSubmittedGuesses, setGuessedLetterColors])

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

    const submitGuess = (): void => {
        if (gameState !== GameState.PLAYING) return;

        if (currentGuess.length !== solution.length) return;

        if (!ALL.has(currentGuess)) {
            if (!invalidWord) {
                setInvalidWord(true);
                setTimeout(() => setInvalidWord(false), 500);
            }
            return;
        }

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

        const newLetterColors = getColorsForGuess(currentGuess);

        setLetterColors([...letterColors, newLetterColors]);
    }

    /**
     * Returns how a guess should be colored based on the player's assumptions.
     */
    const getColorsForGuess = (guess: string): number[] => {
        const res: number[] = [...emptyColors];

        // Occurrences of letters in the guess so far
        const lettersCount: { [letter: string]: number} = {};

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const currentLetterCount = lettersCount[letter] || 0;

            if (guessedLetterColors[letter].correctPositions.includes(i)) {
                res[i] = 3;
                lettersCount[letter] = currentLetterCount + 1;
            }
        }

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const currentLetterCount = lettersCount[letter] || 0;

            if (res[i] !== 3) {
                if (currentLetterCount < guessedLetterColors[letter].letterCount) {
                    res[i] = 2;
                    lettersCount[letter] = currentLetterCount + 1;
                } else if (guessedLetterColors[letter].known) {
                    res[i] = 1;
                } else {
                    res[i] = 0;
                }
            }
        }

        return res;
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

        // If the letter is unknown, set known to true.
        // If a letter is gray, add 1 to the letter count for that letter and set known to false.
        // If a letter is yellow, mark the column as green for that letter.
        // If a letter is green, unmark the column as green and subtract 1 from the letter count for that letter. If
        // the letter count is 1 (now 0), mark the letter as unknown.

        if (gameState !== GameState.PLAYING) return;

        const letter = submittedGuesses[guess][pos];
        const color = letterColors[guess][pos];

        const newGuessedLetterColors = guessedLetterColors;

        // Update known status, letter counts, and correct positions
        switch (color) {
            case 0:
                newGuessedLetterColors[letter].known = true;
                break;
            case 1:
                newGuessedLetterColors[letter].letterCount++;
                newGuessedLetterColors[letter].known = false;
                break;
            case 2:
                newGuessedLetterColors[letter].correctPositions.push(pos);
                if (newGuessedLetterColors[letter].correctPositions.length > newGuessedLetterColors[letter].letterCount) {
                    newGuessedLetterColors[letter].letterCount = newGuessedLetterColors[letter].correctPositions.length;
                }
                break;
            case 3:
                const i = newGuessedLetterColors[letter].correctPositions.indexOf(pos);
                newGuessedLetterColors[letter].correctPositions.splice(i, 1);
                newGuessedLetterColors[letter].letterCount--;
                if (newGuessedLetterColors[letter].letterCount === 0) {
                    newGuessedLetterColors[letter].known = false;
                }
                break;
            default:
                break;
        }

        // Update letter colors on game board
        const newLetterColors: number[][] = [];
        for (const guess of submittedGuesses) {
            newLetterColors.push(getColorsForGuess(guess));
        }

        ReactDOM.unstable_batchedUpdates(() => {
            setGuessedLetterColors(newGuessedLetterColors);
            setLetterColors(newLetterColors);
        });
    }

    const clearLetterColors = () => {
        // Update letter colors on game board
        const newLetterColors: number[][] = [];
        for (let i = 0; i < solution.length; i++) {
            newLetterColors.push([...emptyColors]);
        }

        ReactDOM.unstable_batchedUpdates(() => {
            setGuessedLetterColors(JSON.parse(JSON.stringify(initGuessedLetters)));
            setLetterColors(newLetterColors);
        });
    }

    const numLetters = solution.length;
    const numGuesses = NUM_GUESSES;
    return {solution, numLetters, numGuesses, invalidWord, submittedGuesses,
        currentGuess, gameState, letterColors, guessFeedback,
        addLetter, removeLetter, submitGuess, changeLetterColor, clearLetterColors};
}

export default useGame;