import { AppConfig } from '@kbase/ui-components';
import { StoreState } from '../../../../redux/store';
import DataComponent from './data';
import { connect } from 'react-redux';
import {AuthenticationStatus} from "@kbase/ui-lib";

export interface OwnProps { }

export interface StateProps {
    token: string;
    config: AppConfig;
}

export interface DispatchProps { }

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        authentication,
        app: { config }
    } = state;
    if (authentication.status !== AuthenticationStatus.AUTHENTICATED) {
        throw new Error('Invalid state - no user authorization');
    }
    return {
        token: authentication.userAuthentication.token,
        config
    };
}

function mapDispatchToProps() {
    return {};
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(DataComponent);
