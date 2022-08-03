import React, {Component, useState} from 'react';
import './styles/App.css';
import Header from "./Header";
import GameBoard from "./GameBoard";
import Keyboard from "./Keyboard";
import {ANSWERS} from "./WordList";
import TutorialModal from "./TutorialModal";
import useGame, {Game} from "./hooks/useGame";

// Placeholder answer until a daily answer can be used
const day: number = Math.floor(Math.random() * 1000);
const answer: string = ANSWERS[day];

function App() {
    const game: Game = useGame(answer);

    // Handles keyboard input, calls appropriate methods to update
    // the state of the game.
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            game.submitGuess();
        } else if (event.key === "Backspace") {
            game.removeLetter();
        } else if (event.key.length === 1) {
            const key: string = event.key.toLowerCase();
            if (key.match("[a-z]")) {
                game.addLetter(key);
            }
        }
    }

    return (
        <div className="app-container" onKeyDown={handleKeyPress} tabIndex={0}>
            <Header />
            <TutorialModal isOpen={false} />
            <GameBoard  submittedGuesses={game.submittedGuesses}   currentGuess={game.currentGuess}
                        numLetters={game.numLetters}               numGuesses={game.numGuesses}
                        letterColors={game.letterColors}           guessFeedback={game.guessFeedback}
                        onLetterClicked={game.changeLetterColor} />

            <Keyboard   onBackKeyPressed={game.removeLetter}       onKeyPressed={game.addLetter}
                        onSubmitKeyPressed={game.submitGuess}      letterColors={game.letterColors}
                        submittedGuesses={game.submittedGuesses} />
        </div>
    );
}

export default App;
