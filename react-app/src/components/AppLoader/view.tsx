import { AppError } from '@kbase/ui-components';
import React, { Component } from 'react';
import { Namespace } from '../../lib/OntologyAPIClient';
import { AsyncProcess, AsyncProcessStatus } from '../../lib/processing';
import { OntologyAppData } from '../../redux/store';
import { UIError } from '../../types/error';
import { OntologyReference } from '../../types/ontology';
import { Params } from '../../ui/dispatcher';
import { ViewRouters } from '../../ui/dispatcher/view';
import Dispatcher from '../../ui/dispatcher';
import ErrorView from '../../ui/ErrorView';
import Loading from '../../ui/Loading';
import Term from '../views/term';

export interface AppLoaderProps {
    data: AsyncProcess<OntologyAppData, AppError>;
    loadData: () => void;
}


interface AppLoaderState {

}

export default class AppLoader extends Component<AppLoaderProps, AppLoaderState> {
    componentDidMount() {
        this.props.loadData();
    }

    renderLoading() {
        return <Loading message="Loading ontology base data" />;
    }

    renderError(error: AppError) {
        const err: UIError = {
            code: error.code,
            message: error.message,
            source: 'here'
        };
        return <ErrorView error={err} />;

    }

    renderSuccess(data: OntologyAppData) {
        const views: ViewRouters = {
            about: {
                view: 'about',
                router: (path: Array<string>, params: Params) => {
                    return <div>About here...</div>;
                }
            },
            help: {
                view: 'help',
                router: (path: Array<string>, params: Params) => {
                    return <div>Help here...</div>;
                }
            },
            term: {
                view: 'term',
                router: (path: Array<string>, params: Params) => {
                    // const [namespace, term] = path;
                    if (!params.id) {
                        throw new Error('No id!!');
                    }
                    const namespaces = data.sources.map((source) => {
                        return source.namespace;
                    });
                    if (!namespaces.includes(params.namespace)) {
                        const error: UIError = {
                            code: "namespace-not-found",
                            message: `Namespace ${params.namespace} not found`,
                            source: 'app loader'
                        };
                        return <ErrorView error={error} />;
                    }
                    const ref: OntologyReference = {
                        // TODO: use the app data to validate namespace
                        namespace: params.namespace as Namespace,
                        term: params.id
                    };
                    return <Term termRef={ref} />;
                }
            }
        };
        // if (typeof this.props.children === 'undefined') {
        //     return;
        // }
        // // return React.Children.map(this.props.children, (child) => {
        //     React.cloneElement(child, {
        //         data: this.props.data
        //     });
        // });
        // return this.props.children;
        return <div className="App Col scrollable">
            <Dispatcher views={views} />
        </div>;
    }

    render() {
        // return this.props.children;
        const data = this.props.data;
        switch (data.status) {
            case AsyncProcessStatus.NONE:
            case AsyncProcessStatus.PROCESSING:
                return this.renderLoading();
            case AsyncProcessStatus.SUCCESS:
                return this.renderSuccess(data.state);
            case AsyncProcessStatus.ERROR:
                return this.renderError(data.error);
        }
    }
}