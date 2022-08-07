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
                        Guess a valid five-letter word. The numbers to the right of your guess will
                        show you how close your guess was to the word.
                    </p>
                    <p>
                        The yellow number is the number of letters that are in the answer, but in the
                        incorrect place. The green number is the number of letters in the answer and in
                        the correct place.
                    </p>

                    <p>
                        Examples:
                    </p>
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
                    <p>
                        To help you keep track of which letters are/aren't in the answer, you may tap on the letters
                        in your guess. Tap once if you think the letter isn't in the answer, twice if you think
                        it is in the answer, and thrice if you think it's in the right place. Tap the letter once
                        again if you are still unsure.
                    </p>
                    <img src={tutorialTapLetters}  alt={"tapped letters guess"} />
                </div>
            </GameModal>
        )
    }
}

export default TutorialModal;