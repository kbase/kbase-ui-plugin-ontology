import { AppError, BaseStoreState, makeBaseStoreState } from '@kbase/ui-components';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

import { OntologyReference } from '../../types/ontology';
import { AsyncViewStatus, ViewType } from './view';
import { View } from './views';
import { Source } from '../../lib/OntologyAPIClient';
import { AsyncProcess, AsyncProcessStatus } from '../../lib/processing';

export type RelationEngineID = string;
export enum RelationEngineNodeType {
    TAXON,
    ONTOLOGY_TERM
}

export enum ViewStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface LandingPageStoreState { }


export interface NavigationBase {
    type: ViewType;
    relationEngineID: RelationEngineID;
}

export interface NavigationNone {
    type: ViewType.NONE;
}


export interface NavigationTerm {
    type: ViewType.TERM;
    ref: OntologyReference;
}

export interface NavigationSearch {
    type: ViewType.SEARCH;
    searchTerm: string;
}

export type NavigationSome = NavigationTerm | NavigationSearch;
export type Navigation = NavigationNone | NavigationSome;
// export type View = ViewBase<OntologyView> | null;

export interface OntologyAppData {
    sources: Array<Source>;
}

// STORE STATE type definition
export interface StoreState extends BaseStoreState {
    navigation: Navigation;
    trigger: number;
    view: View;
    ontlologyPlugin: {
        data: AsyncProcess<OntologyAppData, AppError>;
    };
}

// Store Construction
export function makeInitialStoreState(): StoreState {
    const baseStoreState = makeBaseStoreState();
    return {
        ...baseStoreState,
        // viewer: null,
        navigation: {
            type: ViewType.NONE
        },
        trigger: 0,
        view: {
            status: AsyncViewStatus.NONE
        },
        ontlologyPlugin: {
            data: {
                status: AsyncProcessStatus.NONE
            }
        }
    };
}

export function createReduxStore() {
    return createStore(reducer, makeInitialStoreState(), compose(applyMiddleware(thunk)));
}
