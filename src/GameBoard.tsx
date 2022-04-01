import React, {Component} from 'react';
import Guess from "./Guess";
import "./styles/GameBoard.css"

interface GameBoardProps {
    submittedGuesses: string[]; // The list of submitted guesses to provide
                                // feedback on
    currentGuess: string;       // The current guess that hasn't been submitted
                                // yet
    answer: string;             // The word the player is trying to guess
    numGuesses: number          // The number of guesses the player can make
                                // before losing.
    revealed: boolean;          // If true, it will be revealed whether each
                                // letter is in the right place, wrong place,
                                // or not in the answer for all guesses.
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
            if (i < this.props.submittedGuesses.length) {
                // This guess has been submitted, provide feedback on it.
                guess = this.props.submittedGuesses[i];
                submitted = true;
            } else if (i === this.props.submittedGuesses.length) {
                // The player is currently guessing this one
                guess = this.props.currentGuess;
            }

            guesses.push(
                <Guess answer={this.props.answer}   guess={guess}
                       submitted={submitted}        key={i}
                       revealed={this.props.revealed} />
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