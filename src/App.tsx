import React, {Component} from 'react';
import './styles/App.css';
import Header from "./Header";
import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";
import {NUM_GUESSES} from "./Constants";
import GameState from "./GameState";

// Placeholder answer until a daily answer can be used
const answer = "phone";

interface AppState {
    submittedGuesses: string[]; // All guesses that have previously been submitted
                                // by the player. Length must not exceed NUM_GUESSES.
                                // All strings should be the same length as answer.
    currentGuess: string;       // The current guess, should not exceed the length of
                                // answer.
    gameState: GameState;       // The current state of the game.
}

class App extends Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            submittedGuesses: [],
            currentGuess: "",
            gameState: GameState.PLAYING
        }
    }

    // Handles keyboard input, calls appropriate methods to update
    // the state of the game.
    handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            this.submitGuess();
        } else if (event.key === "Backspace") {
            this.removeLetter();
        } else if (event.key.length === 1) {
            const key: string = event.key.toLowerCase();
            if (key.match("[a-z]")) {
                this.addLetter(key);
            }
        }
    }

    // Tries to add a letter to the guess. If the current guess has fewer letters
    // than the answer, adds the letter.
    addLetter = (key: string) => {
        if (this.state.gameState !== GameState.PLAYING) return;

        if (this.state.currentGuess.length < answer.length) {
            this.setState({
                currentGuess: this.state.currentGuess + key
            });
        }
    }

    // Tries to remove a letter from the guess. If the current guess has at least one
    // letter, removes the last letter.
    removeLetter = () => {
        if (this.state.gameState !== GameState.PLAYING) return;

        if (this.state.currentGuess.length > 0) {
            this.setState({
                currentGuess: this.state.currentGuess
                    .substring(0, this.state.currentGuess.length - 1)
            })
        }
    }

    // Tries to submit a guess. If the current guess is the same length as the answer,
    // the current guess is submitted and the new current guess is blank, or if all the
    // guesses have been used, the game is over.
    submitGuess = () => {
        if (this.state.gameState !== GameState.PLAYING) return;

        if (this.state.currentGuess.length === answer.length) {
            // What is a better way to write this? Multiple setState calls in same method?
            if (this.state.currentGuess === answer) {
                this.setState({
                    submittedGuesses: [...this.state.submittedGuesses, this.state.currentGuess],
                    currentGuess: "",
                    gameState: GameState.WON
                });
            } else if (this.state.submittedGuesses.length + 1 === NUM_GUESSES) {
                this.setState({
                    submittedGuesses: [...this.state.submittedGuesses, this.state.currentGuess],
                    currentGuess: "",
                    gameState: GameState.LOST
                });
            } else {
                this.setState({
                    submittedGuesses: [...this.state.submittedGuesses, this.state.currentGuess],
                    currentGuess: ""
                });
            }
        }
    }

    render() {
        return (
            <div className="app-container" onKeyDown={this.handleKeyPress} tabIndex={0}>
                <Header />
                <GameBoard
                    submittedGuesses={this.state.submittedGuesses}
                    currentGuess={this.state.currentGuess}
                    answer={answer}
                    numGuesses={NUM_GUESSES}
                    revealed={this.state.gameState === GameState.LOST
                        || this.state.gameState === GameState.WON}
                />
                <Keyboard
                    onKeyPressed={this.addLetter}
                    onBackKeyPressed={this.removeLetter}
                    onSubmitKeyPressed={this.submitGuess} />
            </div>
        );
    }
}

export default App;
