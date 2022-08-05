import React, {useEffect, useState} from 'react';
import './styles/App.css';
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import TutorialModal from "./components/TutorialModal";
import useGame, {Game} from "./hooks/useGame";
import GameState from "./GameState";
import EndModal from "./components/EndModal";
import ReactDOM from "react-dom";

// Placeholder answer until a daily answer can be used
const day: number = Math.floor(Math.random() * 1000);
// const answer: string = ANSWERS[day];
const answer = "phone";

function App() {
    const game: Game = useGame(answer);
    const [tutorial, setTutorial] = useState<boolean>(true);
    const [end, setEnd] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);

    useEffect(() => {
        const appHeight = () => {
            const doc = document.documentElement
            doc.style.setProperty('--app-height', `${window.innerHeight}px`);
        }

        window.addEventListener('resize', appHeight);
        appHeight();

        return () => {
            window.removeEventListener('resize', appHeight)
        }
    }, [])

    useEffect(() => {
        const removeLetter = game.removeLetter;
        const addLetter = game.addLetter;
        const submitGuess = game.submitGuess;

        // Handles keyboard input, calls appropriate methods to update
        // the state of the game.
        const handleKeyPress = (ev: KeyboardEvent) => {
            if (ev.key === "Enter") {
                submitGuess();
            } else if (ev.key === "Backspace") {
                removeLetter();
            } else if (ev.key.length === 1) {
                const key: string = ev.key.toLowerCase();
                if (key.match("[a-z]")) {
                    addLetter(key);
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        }
    }, [game.removeLetter, game.addLetter, game.submitGuess])

    useEffect(() => {
        if ((game.gameState === GameState.LOST || game.gameState === GameState.WON) && !finished) {
            setTimeout(() => {
                ReactDOM.unstable_batchedUpdates(() => {
                    setEnd(true);
                    setFinished(true);
                });
            }, 1000);
        }
    }, [game.gameState, finished])

    return (
        <div className="app-container" tabIndex={0}>
            <Header />
            <TutorialModal open={tutorial} setOpen={setTutorial}/>
            <EndModal open={end} setOpen={setEnd} won={game.gameState === GameState.WON} solution={answer} />
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
