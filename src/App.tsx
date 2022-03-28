import React, {Component} from 'react';
import './styles/App.css';
import Header from "./Header";
import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";
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

    // Tries to add a letter to the guess. If the current guess has fewer letters
    // than the answer, adds the letter.
    addLetter = (key: string) => {
        console.log(`Added ${key}`);
    }

    // Tries to remove a letter from the guess. If the current guess has at least one
    // letter, removes the last letter.
    removeLetter = () => {
        console.log('Removed key');
    }

    // Tries to submit a guess. If the current guess is the same length as the answer,
    // the current guess is submitted and the new current guess is blank, or if all the
    // guesses have been used, the game is over.
    submitGuess = () => {
        console.log('Submitted guess');
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
                <Keyboard
                    onKeyPressed={this.addLetter}
                    onBackKeyPressed={this.removeLetter}
                    onSubmitKeyPressed={this.submitGuess} />
            </div>
        );
    }
}

export default App;
