// @ts-ignore
import Modal from 'react-modal';

import React, {Component} from 'react';
import closeIcon from '../images/x.png';

interface GameModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
    children?: React.ReactNode;
}

/**
 * The tutorial screen for how to play the game.
 */
class GameModal extends Component<GameModalProps> {
    render() {
        return (
            <Modal
                isOpen={this.props.open}
                contentLabel={"game modal"}
                appElement={document.getElementById('root')}
                style={{
                    content: {
                        maxWidth: '500px',
                        margin: '0 auto'
                    }
                }}
            >
                <div className={"modal-content"}>
                    {this.props.children}
                </div>

                <img src={closeIcon}
                     className={"close"}
                     onClick={() => this.props.setOpen(false)}
                     alt={"close"}/>
            </Modal>
        )
    }
}

export default GameModal;