import React, {Component} from 'react';
import GameModal from "./GameModal";
import {NUM_GUESSES, SHARE_LETTERS} from "../Constants";

interface EndModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
    won: boolean;
    solution: string;
    letterColors: number[][];
    day: number;
}

/**
 * The tutorial screen for how to play the game.
 */
class EndModal extends Component<EndModalProps> {
    getShareText = (): string => {
        const guesses = this.props.won ? this.props.letterColors.length.toString() : "X";
        let res = `Hardle ${this.props.day} ${guesses}/${NUM_GUESSES}\n\n`;

        for (let i = 0; i < this.props.letterColors.length; i++) {
            for (let j = 0; j < this.props.letterColors[0].length; j++) {
                res += SHARE_LETTERS[this.props.letterColors[i][j] - 1];
            }
            res += "\n";
        }

        res += "\n" + window.location.hostname + window.location.pathname;
        return res;
    }

    share = () => {
        const shareText = this.getShareText();
        navigator.clipboard.writeText(shareText).then(() => alert("Copied to clipboard!"));
    }

    render() {
        return (
            <GameModal
                open={this.props.open}
                setOpen={this.props.setOpen}
            >
                <div className={"end-modal-content"}>
                    {this.props.won && (
                        <h2>You won!</h2>
                    )}
                    {!this.props.won && (
                        <h2>The answer was:</h2>
                    )}

                    <h1>{this.props.solution.toUpperCase()}</h1>
                    <button onClick={this.share}>Share</button>
                </div>
            </GameModal>
        )
    }
}

export default EndModal;