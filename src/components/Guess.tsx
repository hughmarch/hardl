import React, {Component} from 'react';
import {DISPLAY_LETTERS} from "../Constants";

interface GuessProps {
    numLetters: number;
    letterColors: number[];
    guess: string;
    submitted: boolean;
    guessFeedback: number[];
    invalidWord: boolean;
    onLetterClicked(position: number): void;
}

/**
 * Represents a single guess in the game. If the guess has been submitted,
 * the number of letters in the answer but in the wrong place, and the number
 * of letters in the answer and in the right place will be displayed as
 * feedback to the player.
 */
class Guess extends Component<GuessProps> {
    onTileClicked = (letter: string, position: number) => {
        if (this.props.submitted) {
            this.props.onLetterClicked(position);
        }
    }

    render() {
        // Give feedback to user if the guess was submitted
        let rightLetters: any = <span/>;
        let wrongLetters: any = <span/>;
        if (this.props.submitted) {
            rightLetters = <span>{this.props.guessFeedback[0]}</span>;
            wrongLetters = <span>{this.props.guessFeedback[1]}</span>;
        }

        // Display the letters in the guess. If the guess doesn't have
        // all the letters, leave it blank.
        const letters: any[] = [];
        for (let i = 0; i < this.props.numLetters; i++) {
            let letter = "";
            let border = "tile-light-border";
            if (this.props.submitted) {
                letter = this.props.guess[i];
                border = DISPLAY_LETTERS[this.props.letterColors[i]];
            } else if (i < this.props.guess.length) {
                letter = this.props.guess[i];
                border = "tile-emphasis-border";
            }
            if (this.props.invalidWord) {
                border += " tile-invalid-word";
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
                <div className={`tile ${this.props.submitted ? "tile-green" : "tile-light-border tile-light-gray"}`}>
                    <div>{rightLetters}</div>
                </div>
                <div className={`tile ${this.props.submitted ? "tile-yellow" : "tile-light-border tile-light-gray"}`}>
                    <div>{wrongLetters}</div>
                </div>
            </div>
        )
    }
}

export default Guess;
