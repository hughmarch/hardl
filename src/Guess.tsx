import React, {Component} from 'react';
import './styles/Guess.css';
import {DISPLAY_LETTERS} from "./Constants";

interface GuessProps {
    answer: string;                         // The answer the player is trying to guess. Feedback
                                            // will be given according to how guess compares with
                                            // answer.
    guess: string;                          // The player's guess. Must not be longer than
                                            // answer, and must be the same length as answer
                                            // when the guess is submitted.
    submitted: boolean;                     // Whether this guess has been submitted.
                                            // Feedback will be provided for submitted
                                            // guesses.
    revealed: boolean;                      // If true, it will be revealed whether each
                                            // letter is in the right place, wrong place,
                                            // or not in the answer. If true, submitted
                                            // should also be true.
    letters: { [key: string]: number[] };   // What the user thinks each letter is: gray, yellow, or
                                            // green for each place on the board.
                                            // (0 = don't know, 1 = gray, 2 = yellow, 3 = green)
    onLetterClicked(letter: string, position: number): void;    // Called when submitted guess's
                                                                // letter is clicked.
}

/**
 * Represents a single guess in the game. If the guess has been submitted,
 * the number of letters in the answer but in the wrong place, and the number
 * of letters in the answer and in the right place will be displayed as
 * feedback to the player.
 */
class Guess extends Component<GuessProps> {
    // Compares the guess to the answer similar to Wordle.
    // Returns: an array of number arrays. compareGuess()[0] is the list of
    // 0-indexed positions of letters in the guess which are in the answer and
    // in the right place, and compareGuess()[1] is a similar list of
    // positions of letters in the guess which are in the answer but in the
    // wrong place.
    // Requirements: guess and answer are the same length and only contain
    // lowercase alphabetical characters
    compareGuess = (guess: string, answer: string): number[][] => {
        const res: number[][] = [[], []];

        // Find letters in the right place first. If the letter is repeated
        // in guess, we want to indicate the letter in the right place.
        for (let i = 0; i < answer.length; i++) {
            if (guess[i] === answer[i]) {
                res[0].push(i);
                // Take out any letters in the answer that have already
                // been used
                answer = answer.substring(0, i) + "-" + answer.substring(i+1);
            }
        }

        for (let i = 0; i < guess.length; i++) {
            for (let j = 0; j < answer.length; j++) {
                if (i === j) {
                    continue;
                }
                if (guess[i] === answer[j]) {
                    res[1].push(i);
                    // Take out any letters in the answer that have already
                    // been used
                    answer = answer.substring(0, j) + "-" + answer.substring(j+1);
                }
            }
        }

        return res;
    }

    onTileClicked = (letter: string, position: number) => {
        if (this.props.submitted) {
            this.props.onLetterClicked(letter, position);
        }
    }

    render() {
        // Give feedback to user if the guess was submitted
        let feedback: number[][] = [];
        let rightLetters: any = <span>•</span>;
        let wrongLetters: any = <span>•</span>;
        if (this.props.submitted) {
            feedback = this.compareGuess(this.props.guess, this.props.answer);
            rightLetters = <span>{feedback[0].length}</span>;
            wrongLetters = <span>{feedback[1].length}</span>;
        }

        // Display the letters in the guess. If the guess doesn't have
        // all the letters, leave it blank.
        const letters: any[] = [];
        for (let i = 0; i < this.props.answer.length; i++) {
            let letter = "";
            let border = "tile-light-border";
            if (this.props.submitted) {
                letter = this.props.guess[i];
                if (this.props.revealed) {
                    if (feedback[0].includes(i)) {
                        border = "tile-green";
                    } else if (feedback[1].includes(i)) {
                        border = "tile-yellow";
                    } else {
                        border = "tile-dark-gray";
                    }
                } else {
                    border = DISPLAY_LETTERS[this.props.letters[letter][i]];
                }
            } else if (i < this.props.guess.length) {
                letter = this.props.guess[i];
                border = "tile-dark-border";
            }

            letters.push(
                <div className={`tile ${border}`} key={i} onClick={
                    () => this.onTileClicked(letter, i)
                }>
                    <div>
                        <span>{letter}</span>
                    </div>
                </div>
            )
        }

        return (
            <div className="guess">
                {letters}
                <div className="tile-spacer" />
                <div className={`tile ${this.props.submitted ? "tile-green" : "tile-light-border"}`}>
                    <div>{rightLetters}</div>
                </div>
                <div className={`tile ${this.props.submitted ? "tile-yellow" : "tile-light-border"}`}>
                    <div>{wrongLetters}</div>
                </div>
            </div>
        )
    }
}

export default Guess;
