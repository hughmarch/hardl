import React, {Component} from 'react';
import './styles/Keyboard.css'

// The QWERTY keyboard layout where a list of strings represents a row on the
// keyboard. SPACER is used as a gap in the keyboard used with flexbox to space
// rows correctly and make all keys the same length. The keyboard includes enter
// and backspace keys.
const KEYS: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['SPACER', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'SPACER'],
    ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK']
]

interface KeyboardProps {
    onKeyPressed(key: string): void;    // Called when a letter key is pressed.
    onBackKeyPressed(): void;           // Called when the back key is pressed.
    onSubmitKeyPressed(): void;         // Called when the submit key is pressed.
}

/**
 * A QWERTY keyboard display for mobile devices.
 */
class Keyboard extends Component<KeyboardProps> {
    // Handles a key press passes the event to the parent.
    onKeyPressed = (key: string) => {
        if (key === "ENTER") {
            this.props.onSubmitKeyPressed();
        } else if (key === "BACK") {
            this.props.onBackKeyPressed();
        } else {
            this.props.onKeyPressed(key);
        }
    }

    render() {
        // Construct the keyboard row by row using KEYS
        const rows: any[] = [];
        for (let i = 0; i < KEYS.length; i++) {
            const rowKeys: any[] = [];

            // Build a single row of keys
            for (let j = 0; j < KEYS[i].length; j++) {
                if (KEYS[i][j] === "SPACER") {
                    // Add a spacer to the row (not a key button)
                    rowKeys.push(
                        <div className="spacer" key={j}/>
                    )
                } else {
                    // Add a key button. ENTER and BACK buttons are wider.
                    rowKeys.push(
                        <button key={j}
                            className={`key ${
                                (KEYS[i][j] === "ENTER" || KEYS[i][j] === "BACK")
                                ? 'key-wide'
                                : ''}`}
                            // Create an anonymous function that calls this.onKeyPressed
                            // with the proper arguments because onClick doesn't take
                            // arguments.
                            onClick={() => this.onKeyPressed(KEYS[i][j])}>
                            {KEYS[i][j]}
                        </button>
                    )
                }
            }

            rows.push(
                <div className="keyboard-row" key={i}>{rowKeys}</div>
            )
        }

        return (
            <div className="keyboard">
                {rows}
            </div>
        )
    }
}

export default Keyboard;
