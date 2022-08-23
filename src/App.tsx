import React, {useEffect, useState} from 'react';
import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Keyboard from "./components/Keyboard";
import TutorialModal from "./components/TutorialModal";
import useGame, {Game} from "./hooks/useGame";
import GameState from "./GameState";
import EndModal from "./components/EndModal";
import {getStorageValue, setStorageValue} from "./storage";
import {START_DATE} from "./Constants";
import SettingsModal, {Settings} from "./components/SettingsModal";
import {useLocalStorage} from "./hooks/useLocalStorage";
import ReactGA from 'react-ga';

const TRACKING_ID = "G-E61RJ18FS5"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);
ReactGA.pageview(window.location.pathname + window.location.search);

const date = new Date();
const time = date.getTime() - START_DATE.getTime();
const day = Math.floor(time / (1000 * 3600 * 24));

function App() {
    const game: Game = useGame(day);
    const [tutorial, setTutorial] = useState<boolean>(false);
    const [end, setEnd] = useState<boolean>(false);
    const [settingsModal, setSettingsModal] = useState<boolean>(false);
    const [settings, setSettings] = useLocalStorage<Settings>("settings",
        {darkMode: false, highContrast: false});

    useEffect(() => {
        if (!tutorial && !getStorageValue<boolean>("visited", false)) {
            setStorageValue("visited", true);
            setTutorial(true);
        }
    }, [tutorial])

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
        let timeout: ReturnType<typeof setTimeout> | null = null;
        if (game.gameState === GameState.LOST || game.gameState === GameState.WON) {
            timeout = setTimeout(() => {
                setEnd(true);
            }, 1000);
        } else {
            setEnd(false);
        }

        return () => {
            if (timeout !== null) {
                clearTimeout(timeout);
            }
        }
    }, [game.gameState])

    useEffect(() => {
        document.documentElement.setAttribute("darkMode", "" + settings.darkMode);
        document.documentElement.setAttribute("highContrast", "" + settings.highContrast);
    }, [settings])

    return (
        <div className="app-container" tabIndex={0} >
            <Header     setTutorial={setTutorial}
                        letterColors={game.letterColors}
                        gameState={game.gameState}
                        onClear={game.clearLetterColors}
                        setSettings={setSettingsModal}
                        setEnd={setEnd} />

            <TutorialModal open={tutorial} setOpen={setTutorial} />

            <SettingsModal  open={settingsModal}
                            setOpen={setSettingsModal}
                            settings={settings}
                            setSettings={setSettings} />

            <EndModal   open={end}
                        setOpen={setEnd}
                        won={game.gameState === GameState.WON}
                        solution={game.solution}
                        letterColors={game.letterColors}
                        day={day} />

            <GameBoard  submittedGuesses={game.submittedGuesses}   currentGuess={game.currentGuess}
                        numLetters={game.numLetters}               numGuesses={game.numGuesses}
                        letterColors={game.letterColors}           guessFeedback={game.guessFeedback}
                        onLetterClicked={game.changeLetterColor}   invalidWord={game.invalidWord} />

            <Keyboard   onBackKeyPressed={game.removeLetter}       onKeyPressed={game.addLetter}
                        onSubmitKeyPressed={game.submitGuess}      letterColors={game.letterColors}
                        submittedGuesses={game.submittedGuesses} />
        </div>
    );
}

export default App;
