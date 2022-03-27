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
    // Gets the positions of letters in the wrong place given a guess and the
    // answer. Guess and answer must be the same length and only contain
    // lowercase alphabetical characters.
    lettersInWrongPlace = (guess: string, answer: string): number[] => {
        const res: number[] = [];
        for (let i = 0; i < guess.length; i++) {
            for (let j = 0; j < answer.length; j++) {
                if (i === j) {
                    continue;
                }
                if (guess[i] === answer[j]) {
                    res.push(i);
                    answer = answer.substring(0, j) + "-" + answer.substring(j+1);
                }
            }
        }
        return res;
    }

    // Gets the positions of letters in the right place given a guess and the
    // answer. Guess and answer must be the same length and only contain
    // lowercase alphabetical characters.
    lettersInRightPlace = (guess: string, answer: string): number[] => {
        const res: number[] = []
        for (let i = 0; i < answer.length; i++) {
            if (guess[i] === answer[i]) {
                res.push(i);
            }
        }
        return res;
    }

    render() {
        // Give feedback to user if the guess was submitted
        let rightLetters: any = <span>•</span>;
        let wrongLetters: any = <span>•</span>;
        if (this.props.submitted) {
            const right = this.lettersInRightPlace(this.props.guess, this.props.answer);
            const wrong = this.lettersInWrongPlace(this.props.guess, this.props.answer);
            rightLetters = <span>{right.length}</span>;
            wrongLetters = <span>{wrong.length}</span>;
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
                <div className={`tile ${border}`}>
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
