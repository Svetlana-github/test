import React from 'react';
import { Table } from 'react-bootstrap';
import EditEngineServerModal from '../../../components/management/applicationSettings/editEngineServerModalComponent';
import EngineServerTranslations from '../../../services/management/applicationSettings/translations/engineManagementTranslations';
require('../../../styles/management/applicationSettings.scss');

class RegisterEngineContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }

    render() {
        return (
            <span>
                <div className="register-engine-server" onClick={this.open}>
                    { EngineServerTranslations.registerEngineServer.toUpperCase() }
                </div>
                <EditEngineServerModal show={this.state.showModal} onHide={this.close} />
            </span>
        );
    }
}

export default RegisterEngineContainer;