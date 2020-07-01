import React from 'react';
import { RootState } from '@kbase/ui-components';
import {
    Navigation,
    NavigationSome
} from '../../redux/store';
import { ViewType } from '../../redux/store/view';
import TermView from '../term';
import { Namespace } from '../../lib/OntologyAPIClient';

export interface DispatcherProps {
    token: string | null;
    rootState: RootState;
    navigation: Navigation;
    trigger: number;
    navigate: (navigation: Navigation) => void;
}

interface DispatcherState { }

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

export class Dispatcher extends React.Component<DispatcherProps, DispatcherState> {
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
        // const message = <div>
        //     <p>
        //         This navigation not supported
        //     </p>
        //     <p>
        //         {this.props.navigation.type}
        //     </p>
        // </div>;
        // return <Alert type="error" message={message} />;
        return null;
    }

    renderNavigationSome(navigation: NavigationSome) {
        // This is currently how we dispatch to the type-specific
        // landing page.
        switch (navigation.type) {
            case ViewType.TERM:
                return <TermView termRef={navigation.ref} />;
            case ViewType.SEARCH:
                return <div>Sorry, search not yet supported.</div>;
            default:
                // TODO: make real error display.
                console.error('Unhandled navigation', navigation);
        }
    }

    renderNavigation() {
        switch (this.props.navigation.type) {
            case ViewType.NONE:
                return this.renderNavigationNone();
            default:
                return this.renderNavigationSome(this.props.navigation);
            // case ViewStatus.LOADING:
            //     return this.renderNavigationLoading(this.props.view);
            // case ViewStatus.LOADED:
            //     return this.renderNavigationLoaded(this.props.view);
            // case ViewStatus.ERROR:
            //     return this.renderNavigationError(this.props.view);
        }
    }

    parseHash(hash: string): Navigation {
        // const hashRe = /^#(.*?)\/(.*)$/;
        const hashRe: RegExp = /^#[/]?ontology\/(.*?)\/(.*)$/;
        const m = hashRe.exec(hash);

        if (!m) {
            throw new Error('Invalid path');
        }

        // Just for now...
        // TODO: for real

        const [, view, rest] = m;

        switch (view) {
            case 'term':
                const [dataSource, ref] = rest.split('/');
                return {
                    type: ViewType.TERM,
                    ref: {
                        namespace: stringToNamespace(dataSource),
                        term: ref
                    }
                };
            case 'search':
                const searchTerm = rest;
                return {
                    type: ViewType.SEARCH,
                    searchTerm
                };
            default:
                throw new Error(`Sorry, no dice for ${view}`);
        }

        // return {
        //     path: [path],
        //     params: { relationEngineID }
        // };
    }

    componentDidMount() {
        if (this.props.rootState === RootState.DEVELOP) {
            // Navigate on change of the hash
            window.addEventListener('hashchange', (ev: HashChangeEvent) => {
                const url = new URL(ev.newURL);
                const hash = url.hash;
                if (!hash) {
                    throw new Error('no hash!');
                }
                this.props.navigate(this.parseHash(hash));
            });

            // First time here, we also want to navigate based on the
            // hash, or if empty (the default when a dev session starts)
            // use some default interesting taxon id.
            const hash = window.location.hash;
            if (hash) {
                this.props.navigate(this.parseHash(hash));
            } else {
                // TODO: remove?
                // #review/ontology/go/GO:0007610
                // this.props.navigate('ncbi_taxonomy/562');
                // this.props.navigate('go_ontology/GO:0007610');
                throw new Error('No path to the ontology plugin, perhaps try #ontology/go_ontology/GO:0007610');
            }
        }
    }

    render() {
        if (!this.props.token) {
            return this.renderUnauthorized();
        }
        return (
            <div className="Col scrollable">
                <div className="Row-auto">{this.renderRootState()}</div>
                <div className="Row  scrollable">{this.renderNavigation()}</div>
            </div>
        );
    }
}
