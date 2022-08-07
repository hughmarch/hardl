import React, {Component} from 'react';
import infoIcon from "../images/info.png";

interface HeaderProps {
    setTutorial: (open: boolean) => void;
}

/**
 * The header for the app, containing the title, etc.
 */
class Header extends Component<HeaderProps> {
    showTutorial = () => {
        this.props.setTutorial(true);
    }

    render() {
        return (
            <header>
                <h1>Hardl</h1>
                <img src={infoIcon} alt={"info"} onClick={this.showTutorial}/>
            </header>
        );
    }
}

export default Header;
