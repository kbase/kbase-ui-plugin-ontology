import { UIError } from '../../types/error';

// VIEW STATES

/*
 Sync view state
 Primarily for top level views which don't have an async load operation.
*/

export enum SyncViewStatus {
    NONE,
    LOADED,
    ERROR
}

export interface SyncViewNone {
    status: SyncViewStatus.NONE;
}

export interface SyncViewError<E> {
    status: SyncViewStatus.ERROR;
    error: E;
}

export interface SyncViewLoaded<S> {
    status: SyncViewStatus.LOADED;
    state: S;
}
export type SyncView<S, E> = SyncViewNone | SyncViewLoaded<S> | SyncViewError<E>;

// And the specific landing page views

export enum AsyncViewStatus {
    NONE,
    LOADING,
    LOADED,
    ERROR
}

export interface AsyncViewNone<> {
    status: AsyncViewStatus.NONE;
}

export interface AsyncViewLoading<> {
    status: AsyncViewStatus.LOADING;
}

export interface AsyncViewError<E> {
    status: AsyncViewStatus.ERROR;
    error: E;
}

export interface AsyncViewLoaded<S> {
    status: AsyncViewStatus.LOADED;
    state: S;
}

export type AsyncView<S, E> = AsyncViewNone | AsyncViewLoading | AsyncViewLoaded<S> | AsyncViewError<E>;

/*
The view base is the wrapper for all landing page views.
It's purpose is to provide an anchor for the view, regardless of what happens in that view
(which is to be found in the "state" property)
*/

export enum ViewType {
    NONE,
    TERM,
    SEARCH
}

export interface ViewBase<S> {
    type: ViewType;
    state: AsyncView<S, UIError>;
}

