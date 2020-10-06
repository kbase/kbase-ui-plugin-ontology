import { AppError } from '@kbase/ui-components';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import OntologyAPIClient, { Source } from '../../lib/OntologyAPIClient';
import { StoreState } from '../store';
import { View } from '../store/views';

export enum AppActions {
    LOAD_DATA = 'OntologyLandingPage$LOAD_DATA',
    LOAD_DATA_START = 'OntologyLandingPage$LOAD_DATA_START',
    LOAD_DATA_SUCCESS = 'OntologyLandingPage$LOAD_DATA_SUCCESS',
    LOAD_DATA_ERROR = 'OntologyLandingPage$LOAD_DATA_ERROR',
}

export interface LoadDataStart extends Action<AppActions.LOAD_DATA_START> {
    type: AppActions.LOAD_DATA_START;
}
export interface LoadDataSuccess extends Action<AppActions.LOAD_DATA_SUCCESS> {
    type: AppActions.LOAD_DATA_SUCCESS;
    data: {
        sources: Array<Source>;
    };
}

export interface LoadDataError extends Action<AppActions.LOAD_DATA_ERROR> {
    type: AppActions.LOAD_DATA_ERROR;
    error: AppError;
}

export function loadDataStart(): LoadDataStart {
    return {
        type: AppActions.LOAD_DATA_START
    };
}

export function loadDataSuccess(sources: Array<Source>): LoadDataSuccess {
    return {
        type: AppActions.LOAD_DATA_SUCCESS,
        data: { sources }
    };
}

export function loadDataError(code: string, message: string): LoadDataError {
    return {
        type: AppActions.LOAD_DATA_ERROR,
        error: {
            code, message
        }
    };
}

export function loadData() {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(loadDataStart());

        const {
            auth: { userAuthorization },
            app: {
                config: {
                    dynamicServices: {
                        OntologyAPI: {
                            version
                        }
                    },
                    services: {
                        ServiceWizard: {
                            url
                        }
                    }
                }
            }
        } = getState();

        // Auth integration.

        if (!userAuthorization) {
            throw new Error('No user authorization');
        }
        const token = userAuthorization.token;

        const client = new OntologyAPIClient({
            token, url, version
        });

        const sources = await client.get_sources();

        try {
            dispatch(loadDataSuccess(sources));
        } catch (ex) {
            console.error('ERROR', ex);
            dispatch(loadDataError('loading-data', ex.message));
        }

    };
}

export function view(view: View) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {

    };
}
