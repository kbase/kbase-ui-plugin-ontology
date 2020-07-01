import React from 'react';
import { RootState, AppError } from '@kbase/ui-components';
import { Alert } from 'antd';
import { Params } from '.';
import TermView from '../../components/term';
import { OntologyReference } from '../../types/ontology';
import { Namespace } from '../../lib/OntologyAPIClient';

function stringToNamespace(s: string): Namespace {
    switch (s) {
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
        default:
            throw Error(`Not a namespace: ${s}`);
    }
}

export interface Route {
    view: string;
    router: (path: Array<string>, params: Params) => React.ReactNode;
}

export interface Routes {
    [key: string]: Route;
}

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    view: string | null;
    path: Array<string>;
    params: Params;
}

interface DispatcherState {
    view: string | null;
    path: Array<string>;
    params: Params;
    currentRoute: Route | null;
}

export class Dispatcher extends React.Component<DispatcherProps, DispatcherState> {
    routes: Routes;

    constructor(props: DispatcherProps) {
        super(props);

        this.routes = {
            term: {
                view: 'term',
                router: (path: Array<string>, params: Params) => {
                    const [namespace, term] = path;
                    if (!term) {
                        throw new Error('No term!!');
                    }
                    const ref: OntologyReference = {
                        namespace: stringToNamespace(namespace),
                        term
                    };
                    return <TermView termRef={ref} />;
                }
            }
        };

        this.state = {
            view: this.props.view,
            path: this.props.path,
            params: this.props.params,
            currentRoute: null
        };
    }

    renderUnauthorized() {
        return <div>Sorry, not authorized. Please log in first.</div>;
    }

    renderRootState() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return '';
            case RootState.HOSTED:
                return '';
            case RootState.DEVELOP:
                return '';
            case RootState.ERROR:
                return 'error';
        }
    }

    renderNavigationNone() {
        const message = <div>
            NONE
        </div>;
        return <Alert type="error" message={message} />;
    }

    componentDidMount() {
        if (this.props.view === null) {
            return;
        }

        const route = this.routes[this.props.view];

        if (!route) {
            return;
        }

        this.setState({
            currentRoute: route
        });
    }

    renderError(error: AppError) {
        return <Alert type="error" message={error.message} />;
    }

    renderNotFound(view: string) {
        return <Alert type="warning" message={`Not Found: ${view}`} />;
    }

    renderEmptyRoute() {
        return <div>
            Sorry, empty route.
        </div>;
    }

    renderRoute() {
        if (this.state.currentRoute === null) {
            return this.renderEmptyRoute();
        }
        return this.state.currentRoute.router(this.props.path, this.props.params);
    }

    render() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return this.renderRoute();
    }
}
