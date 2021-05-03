import { AppConfig, sendTitle } from '@kbase/ui-components';
import { StoreState } from '../../../../redux/store';
import DataComponent from './data';
import { connect } from 'react-redux';
import { Dispatch } from 'react';
import { Action } from 'redux';
import {AuthenticationStatus} from "@kbase/ui-lib";

export interface OwnProps { }

export interface StateProps {
    token: string;
    config: AppConfig;
}

export interface DispatchProps {
    setTitle: (title: string) => void;
}

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

function mapDispatchToProps(dispatch: Dispatch<Action>, props: OwnProps): DispatchProps {
    return {
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(DataComponent);
