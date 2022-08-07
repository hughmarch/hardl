import React, {Component} from 'react';
import tutorialNoLetters from '../images/tutorial-no-letters.png';
import tutorialSomeLetters from '../images/tutorial-some-letters.png';
import tutorialTapLetters from '../images/tutorial-tap-letters.png';
import GameModal from "./GameModal";

interface TutorialModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
}

/**
 * The tutorial screen for how to play the game.
 */
class TutorialModal extends Component<TutorialModalProps> {
    render() {
        return (
            <GameModal
                open={this.props.open}
                setOpen={this.props.setOpen}
            >
                <div className={"tutorial-modal-content"}>
                    <h2>How to play HARDL:</h2>
                    <p>
                        HARDL is similar to Wordle, but takes inspiration from the game Mastermind
                        to add a challenging twist.
                        To start, guess a valid five-letter word. The numbers to the right of your
                        guess will show you how close your guess was to the word.
                    </p>
                    <p>
                        In yellow is number of letters that are in the answer, but in the
                        incorrect place. In green is the number of letters in the answer and in
                        the correct place.
                    </p>
                    <br/>
                    <img src={tutorialSomeLetters}  alt={"guess"} />
                    <p>
                        This guess has 1 letter in the incorrect spot and 1 letter in the correct spot.
                        You don't know which letters they are.
                    </p>
                    <br/>
                    <img src={tutorialNoLetters}  alt={"no letters guess"} />
                    <p>
                        None of the letters in this guess are in the answer.
                    </p>
                    <br/>
                    <img src={tutorialTapLetters}  alt={"tapped letters guess"} />
                    <p>
                        Can you change the colors of the letters to keep track of which letters you
                        think are/aren't in the answer? Yes! Just tap on the letters in your guess until
                        it is the color you want.
                    </p>
                </div>
            </GameModal>
        )
    }
}

export default TutorialModal;