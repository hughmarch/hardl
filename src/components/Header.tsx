import React, {Component} from 'react';
import infoIcon from "../images/info.png";
import GameState from "../GameState";

interface HeaderProps {
    setTutorial: (open: boolean) => void;
    letterColors: number[][];
    gameState: GameState;
    onClear: () => void;
}

/**
 * The header for the app, containing the title, etc.
 */
class Header extends Component<HeaderProps> {
    showTutorial = () => {
        this.props.setTutorial(true);
    }

    render() {
        let showClearButton = false;
        if (this.props.gameState === GameState.PLAYING) {
            for (let i = 0; i < this.props.letterColors.length && !showClearButton; i++) {
                for (let j = 0; j < this.props.letterColors[0].length && !showClearButton; j++) {
                    if (this.props.letterColors[i][j] !== 0) {
                        showClearButton = true;
                    }
                }
            }
        }

        return (
            <header>
                {showClearButton && <button onClick={this.props.onClear}>Clear</button>}
                <h1>Hardl</h1>
                <img src={infoIcon} alt={"info"} onClick={this.showTutorial}/>
            </header>
        );
    }
}

export default Header;
