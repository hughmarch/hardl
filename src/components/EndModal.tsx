import React, {Component} from 'react';
import GameModal from "./GameModal";
import {NUM_GUESSES, SHARE_LETTERS} from "../Constants";
import githubIcon from "../images/github.png";
import linkedinIcon from "../images/linkedin.png";
import {isMobile} from 'react-device-detect';

interface EndModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
    won: boolean;
    solution: string;
    letterColors: number[][];
    day: number;
}

/**
 * A modal showing the results of the game once it has finished.
 */
class EndModal extends Component<EndModalProps> {
    getShareText = (): string => {
        const guesses = this.props.won ? this.props.letterColors.length.toString() : "X";
        let res = `Hardl ${this.props.day} ${guesses}/${NUM_GUESSES}\n`;

        for (let i = 0; i < this.props.letterColors.length; i++) {
            res += "\n";
            for (let j = 0; j < this.props.letterColors[0].length; j++) {
                res += SHARE_LETTERS[this.props.letterColors[i][j] - 1];
            }
        }

        return res;
    }

    share = () => {
        const shareText = this.getShareText();
        if (isMobile && navigator.share) {
            navigator.share({text: shareText});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => alert("Copied to clipboard!"));
        } else {
            alert("Sharing not enabled");
        }
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

                    <p>{this.props.won ? "Play" : "Try"} again tomorrow!</p>

                    <div className={"button-bar"}>
                        <button onClick={this.share}>Share</button>
                        <div className={"end-modal-links"}>
                            <a href={"https://github.com/hughmarch/hardl"}>
                                <img src={githubIcon} alt={"github"} />
                            </a>
                            <a href={"https://www.linkedin.com/in/hugh-march/"}>
                                <img src={linkedinIcon} alt={"linkedin"} />
                            </a>
                        </div>
                    </div>
                </div>
            </GameModal>
        )
    }
}

export default EndModal;