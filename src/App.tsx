import React, {Component} from 'react';
import './styles/App.css';
import Header from "./Header";
import GameBoard from "./GameBoard";
import {NUM_GUESSES} from "./Constants";

// Placeholder answer until a daily answer can be used
const answer = "phone";

interface AppState {
    submittedGuesses: string[]; // All guesses that have previously been submitted
                                // by the player. Length must not exceed NUM_GUESSES.
                                // All strings should be the same length as answer.
    currentGuess: string;       // The current guess, should not exceed the length of
                                // answer.
}

class App extends Component<{}, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            // Placeholder guesses until player input is implemented
            submittedGuesses: ["tears", "chant", "stone"],
            currentGuess: "pro"
        }
    }

    render() {
        return (
            <div className="app-container">
                <Header />
                <GameBoard
                    submittedGuesses={this.state.submittedGuesses}
                    currentGuess={this.state.currentGuess}
                    answer={answer}
                    numGuesses={NUM_GUESSES}
                />
            </div>
        );
    }
}

export default App;
