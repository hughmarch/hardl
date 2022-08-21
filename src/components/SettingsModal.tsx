import React, {Component} from 'react';
import GameModal from "./GameModal";

interface SettingsModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
}

/**
 * A modal showing the results of the game once it has finished.
 */
class SettingsModal extends Component<SettingsModalProps> {
    render() {
        return (
            <GameModal
                open={this.props.open}
                setOpen={this.props.setOpen}
            >
                <div className={"settings-modal-content"}>
                    
                </div>
            </GameModal>
        )
    }
}

export default SettingsModal;