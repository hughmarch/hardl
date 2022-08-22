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
 * An abstract base modal that is styled and has a close icon.
 */
class GameModal extends Component<GameModalProps> {
    render() {
        return (
            <Modal
                isOpen={this.props.open}
                contentLabel={"game modal"}
                appElement={document.getElementById('root')}
                onRequestClose={() => this.props.setOpen(false)}
                closeTimeoutMS={200}
                style={{
                    content: {
                        maxWidth: '500px',
                        margin: '0 auto',
                        background: 'var(--color-background)',
                        borderRadius: '10px'
                    },

                    overlay: {
                        background: 'var(--color-overlay)'
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