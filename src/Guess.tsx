import React, {Component} from 'react';
import './styles/Guess.css';

interface GuessProps {
    answer: string;     // The answer the player is trying to guess. Feedback
                        // will be given according to how guess compares with
                        // answer.
    guess: string;      // The player's guess. Must not be longer than
                        // answer, and must be the same length as answer
                        // when the guess is submitted.
    submitted: boolean; // Whether this guess has been submitted.
                        // Feedback will be provided for submitted
                        // guesses.
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

    render() {
        // Give feedback to user if the guess was submitted
        let rightLetters: any = <span>•</span>;
        let wrongLetters: any = <span>•</span>;
        if (this.props.submitted) {
            const feedback = this.compareGuess(this.props.guess, this.props.answer);
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
                // This guess has been submitted
                letter = this.props.guess[i];
                border = "tile-gray";
            } else if (i < this.props.guess.length) {
                // The guess contains a letter in this position
                letter = this.props.guess[i];
                border = "tile-dark-border";
            }

            letters.push(
                <div className={`tile ${border}`} key={i}>
                    <div>
                        <span>{letter}</span>
                    </div>
                </div>
            )
        }

        return (
            <div className="guess">
                {letters}
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
