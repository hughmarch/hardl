import React, {useEffect, useState} from 'react';
import './styles/App.css';
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import {ANSWERS} from "./WordList";
import TutorialModal from "./components/TutorialModal";
import useGame, {Game} from "./hooks/useGame";
import GameState from "./GameState";

// Placeholder answer until a daily answer can be used
const day: number = Math.floor(Math.random() * 1000);
const answer: string = ANSWERS[day];

function App() {
    const game: Game = useGame(answer);
    const [tutorial, setTutorial] = useState<boolean>(true);

    useEffect(() => {
        console.log("render");
        // Handles keyboard input, calls appropriate methods to update
        // the state of the game.
        const handleKeyPress = (ev: KeyboardEvent) => {
            if (ev.key === "Enter") {
                game.submitGuess();
            } else if (ev.key === "Backspace") {
                game.removeLetter();
            } else if (ev.key.length === 1) {
                const key: string = ev.key.toLowerCase();
                if (key.match("[a-z]")) {
                    game.addLetter(key);
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        if (game.gameState === GameState.WON) {
            alert("You win");
        } else if (game.gameState === GameState.LOST) {
            alert("The word was " + answer);
        }

        return () => window.removeEventListener('keydown', handleKeyPress);
    })

    return (
        <div className="app-container" tabIndex={0}>
            <Header />
            <TutorialModal open={tutorial} setOpen={setTutorial}/>
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
