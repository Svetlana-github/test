import React from 'react';
import { inject, observer } from 'mobx-react';
import EngineManagementComponent from '../../../components/management/applicationSettings/engineManagementComponent';
import ArraySortService from '../../../services/general/arraySortService';
import EngineServerTranslations from '../../../services/management/applicationSettings/translations/engineManagementTranslations';
import InfoMessageModal from '../../../components/reusable/portal/infoMessageModalComponent';
import { tableColumns, statusSortPriority } from '../../../services/enums/management/applicationSettings/engineServers';
import { engineManagementPage } from '../../../services/enums/management/applicationSettings/engineServers';
import { engineServersMessageCodes } from '../../../services/enums/systemMessagesCodes';

@inject('EnginesStore', 'ActiveUserStore') @observer
class EngineManagementContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: tableColumns.status,
            isAscending: true
        };
        this.updateSortState = this.updateSortState.bind(this);
        this.sortEngineServers = this.sortEngineServers.bind(this);
        this.arraySortService = new ArraySortService();
        this.closeError = this.closeError.bind(this);
        this.dialogClassName = 'error-message engine-mgmt-action-modal';
    }

    componentDidMount() {
        this.props.EnginesStore.getEngineServers();

        this.interval = setInterval(() => {
            // Only perform request if user is not on idle mode
            if( this.props.ActiveUserStore.isUserIdle === false)
                this.props.EnginesStore.getEngineServers();
        }, engineManagementPage.refreshTime);
    }

    getErrorTitle(error) {
        if(!this.props.EnginesStore.isError){
            return '';
        }

        if (error.messageCode === engineServersMessageCodes.loadingEnginesFailed) {
            return EngineServerTranslations.loadingEnginesError;
        }

        return EngineServerTranslations.engineRegistrationError;
    }
    
    getErrorMessage(error) {
        if(!this.props.EnginesStore.isError){
            return '';
        }

        if (error.messageCode === engineServersMessageCodes.duplicatedNameOrUri) {
            return EngineServerTranslations.duplicatedNameOrUri;
        }

        if (error.messageCode === engineServersMessageCodes.loadingEnginesFailed) {
            return error.message || EngineServerTranslations.loadingEnginesErrorMessage;
        }

        return error.messageDetails;
    }

    closeError() {
        this.props.EnginesStore.resetError();
    }

    updateSortState(key, isAscending) {
        this.setState({
            key: key,
            isAscending: isAscending
        });
    }

    sortEngineServers(array, key, isAscending) {
        let copiedArray = array.slice();
        if (key === tableColumns.status) {
            this.arraySortService.sortByPriority(copiedArray, key, statusSortPriority);
        } else {
            this.arraySortService.caseInsensitiveSort(copiedArray, key, statusSortPriority);
        }

        if (!isAscending) {
            copiedArray.reverse();
        }

        return copiedArray;
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let sortedEngineServers;
        if (this.props.EnginesStore.enginesLoaded) {
            sortedEngineServers = this.sortEngineServers(this.props.EnginesStore.engines, this.state.key, this.state.isAscending);
            return (
                <div>
                    <EngineManagementComponent servers={ sortedEngineServers } handleClick={this.updateSortState}/>
                    <InfoMessageModal
                        show={this.props.EnginesStore.isError}
                        onHide={this.closeError}
                        message={this.getErrorMessage(this.props.EnginesStore.error)}
                        title={this.getErrorTitle(this.props.EnginesStore.error)}
                        dialogClassName={this.dialogClassName}/>
                </div>
            );

        }
        return null;
    }
}

export default EngineManagementContainer;