import React, {Component} from 'react';
import Guess from "./Guess";

interface GameBoardProps {
    submittedGuesses: string[];
    currentGuess: string;
    numLetters: number;
    numGuesses: number;
    letterColors: number[][];
    guessFeedback: number[][];
    invalidWord: boolean;
    onLetterClicked(guess: number, position: number): void;
}

/**
 * Displays information about the state of the game as a list of guesses.
 */
class GameBoard extends Component<GameBoardProps> {
    render() {
        // The game board is a list of guesses that are either already submitted,
        // currently being used, or haven't been used yet.
        const guesses: any[] = [];
        for (let i = 0; i < this.props.numGuesses; i++) {
            let submitted = false;
            let guess = "";
            let letterColors: number[] = [];
            let guessFeedback: number[] = [];
            let invalidWord = false;
            if (i < this.props.submittedGuesses.length) {
                // This guess has been submitted, provide feedback on it.
                guess = this.props.submittedGuesses[i];
                letterColors = this.props.letterColors[i];
                guessFeedback = this.props.guessFeedback[i];
                submitted = true;
            } else if (i === this.props.submittedGuesses.length) {
                // The player is currently guessing this one
                guess = this.props.currentGuess;
                invalidWord = this.props.invalidWord;
            }

            guesses.push(
                <Guess numLetters={this.props.numLetters}   guess={guess}
                       submitted={submitted}                key={i}
                       onLetterClicked={pos => this.props.onLetterClicked(i, pos)}
                       letterColors={letterColors}
                       guessFeedback={guessFeedback}
                       invalidWord={invalidWord} />
            )
        }

        return (
            <div className="game-board-container">
                {guesses}
            </div>
        )
    }
}

export default GameBoard