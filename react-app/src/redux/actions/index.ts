import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { StoreState, RelationEngineID, Navigation } from '../store';
import { View } from '../store/views';

export enum AppActions {
    NAVIGATE = 'kbase-ui-plugin-landing-pages/navigate',
    NAVIGATE_START = 'kbase-ui-plugin-landing-pages/navigate/start',
    NAVIGATE_SUCCESS = 'kbase-ui-plugin-landing-pages/navigate/success',
    NAVIGATE_ERROR = 'kbase-ui-plugin-landing-pages/navigate/error'
}

export interface Navigate extends Action<AppActions.NAVIGATE> {
    type: AppActions.NAVIGATE;
    relationEngineID: RelationEngineID;
}

export interface NavigateStart extends Action<AppActions.NAVIGATE_START> {
    type: AppActions.NAVIGATE_START;
}

export interface NavigateSuccess extends Action<AppActions.NAVIGATE_SUCCESS> {
    type: AppActions.NAVIGATE_SUCCESS;
    navigation: Navigation;
}

export interface NavigateError extends Action<AppActions.NAVIGATE_ERROR> {
    type: AppActions.NAVIGATE_ERROR;
    message: string;
}

export function navigateStart(): NavigateStart {
    return {
        type: AppActions.NAVIGATE_START
    };
}

export function navigateError(message: string): NavigateError {
    return {
        type: AppActions.NAVIGATE_ERROR,
        message
    };
}

export function navigateSuccess(
    navigation: Navigation
): NavigateSuccess {
    return {
        type: AppActions.NAVIGATE_SUCCESS,
        navigation
    };
}

export function navigate(navigation: Navigation) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {
        dispatch(navigateStart());

        try {
            dispatch(navigateSuccess(navigation));
        } catch (ex) {
            console.error('ERROR', ex);
            dispatch(navigateError(ex.message));
        }

    };
}

export function view(view: View) {
    return async (dispatch: ThunkDispatch<StoreState, void, Action>, getState: () => StoreState) => {

    };
}
