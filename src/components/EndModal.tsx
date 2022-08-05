import React, {Component} from 'react';
import '../styles/GameModal.css'
import GameModal from "./GameModal";

interface WinModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
    won: boolean;
    solution: string;
}

/**
 * The tutorial screen for how to play the game.
 */
class EndModal extends Component<WinModalProps> {
    render() {
        return (
            <GameModal
                open={this.props.open}
                setOpen={this.props.setOpen}
            >
                {this.props.won && (
                    <h2>You won!</h2>
                )}
                {!this.props.won && (
                    <h2>The answer was: {this.props.solution}</h2>
                )}
            </GameModal>
        )
    }
}

export default EndModal;