import React, {Component} from 'react';
import GameModal from "./GameModal";
import ReactSwitch from "react-switch";

export interface Settings {
    darkMode: boolean;
    highContrast: boolean;
}

interface SettingsModalProps {
    open: boolean;                      // Whether the tutorial modal is visible
    setOpen: (open: boolean) => void;   // Sets the modal's visibility
    settings: Settings;
    setSettings: (settings: Settings) => void;
}

/**
 * A modal showing the results of the game once it has finished.
 */
class SettingsModal extends Component<SettingsModalProps> {
    setDarkMode = (on: boolean) => {
        this.props.setSettings({
            darkMode: on,
            highContrast: this.props.settings.highContrast
        });
    }

    setHighContrast = (on: boolean) => {
        this.props.setSettings({
            darkMode: this.props.settings.darkMode,
            highContrast: on
        });
    }

    render() {
        return (
            <GameModal
                open={this.props.open}
                setOpen={this.props.setOpen}
            >
                <div className={"settings-modal-content"}>
                    <h2>Settings</h2>
                    <div className={"setting"}>
                        <h4>Dark Mode</h4>
                        <ReactSwitch onChange={this.setDarkMode} checked={this.props.settings.darkMode} />
                    </div>

                    <div className={"setting"}>
                        <div>
                            <h4>High Contrast Mode</h4>
                            <p>For improved color vision</p>
                        </div>
                        <ReactSwitch onChange={this.setHighContrast} checked={this.props.settings.highContrast} />
                    </div>
                </div>
            </GameModal>
        )
    }
}

export default SettingsModal;