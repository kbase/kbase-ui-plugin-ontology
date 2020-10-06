import { Action, Reducer } from 'redux';
import { baseReducer, BaseStoreState } from '@kbase/ui-components';
import { StoreState } from '../store';
import { AppActions, LoadDataError, LoadDataStart, LoadDataSuccess } from '../actions';
import { AsyncProcessStatus } from '../../lib/processing';

function loadDataStart(state: StoreState, action: LoadDataStart): StoreState {
    return {
        ...state,
        ontlologyPlugin: {
            data: {
                status: AsyncProcessStatus.NONE
            }
        }
    };
}

function loadDataSuccess(state: StoreState, action: LoadDataSuccess): StoreState {
    return {
        ...state,
        ontlologyPlugin: {
            data: {
                status: AsyncProcessStatus.SUCCESS,
                state: {
                    sources: action.data.sources
                }
            }

        }
    };
}


function loadDataError(state: StoreState, action: LoadDataError): StoreState {
    return {
        ...state,
        ontlologyPlugin: {
            data: {
                status: AsyncProcessStatus.ERROR,
                error: action.error
            }

        }
    };
}

// function navigateStart(state: StoreState, action: NavigateStart): StoreState {
//     return {
//         ...state,
//         view: {
//             status: ViewStatus.LOADING
//         }
//     };
// }

const reducer: Reducer<StoreState | undefined, Action> = (state: StoreState | undefined, action: Action) => {
    const baseState = baseReducer(state as BaseStoreState, action);
    if (baseState) {
        return baseState as StoreState;
    }
    if (!state) {
        return state;
    }
    switch (action.type) {
        case AppActions.LOAD_DATA_START:
            return loadDataStart(state, action as LoadDataStart);
        case AppActions.LOAD_DATA_SUCCESS:
            return loadDataSuccess(state, action as LoadDataSuccess);
        case AppActions.LOAD_DATA_ERROR:
            return loadDataError(state, action as LoadDataError);
    }
    return state;
};

export default reducer;
