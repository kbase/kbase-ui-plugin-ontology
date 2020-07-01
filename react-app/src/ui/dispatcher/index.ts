import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { Dispatcher } from './view';
import { RootState } from '@kbase/ui-components';
import { StoreState } from '../../redux/store';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    view: string | null;
    path: Array<string>;
    params: Params;
}

export interface Params {
    [key: string]: string;
}
interface DispatchProps {
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        root: { state: rootState },
        app: {
            runtime: {
                navigation: {
                    view, params
                }
            }
        }
    } = state;


    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    const viewParams = {
        ...params
    };
    delete viewParams.rest;
    delete viewParams.view;

    const trigger: number = 1;
    return {
        token,
        rootState,
        view: view || null,
        path: params.rest.split('/'),
        params: params
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
