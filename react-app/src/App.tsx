import React from 'react';
import {Provider} from 'react-redux';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {AppBase, AuthGate, ErrorBoundary} from '@kbase/ui-components';
import {createReduxStore} from './redux/store';
import About from "./views/About";
import Help from "./views/Help";
import Term from "./views/Term";
import NotFound from "./views/NotFound";
import './App.css';


const store = createReduxStore();

interface AppProps {
}

interface AppState {
}

export default class App<AppProps, AppState> extends React.Component {
    render() {
        return (
            <HashRouter>
                <ErrorBoundary>
                    <Provider store={store}>
                        <AppBase>
                            <AuthGate required={true}>
                                <Switch>
                                    <Route path="/ontology/about" children={About}/>
                                    <Route path="/ontology/help" children={Help}/>
                                    <Route path="/ontology/term/:namespace/:id/:ts?" children={Term}/>
                                    <Route children={NotFound} exact={true}/>
                                </Switch>
                            </AuthGate>
                        </AppBase>
                    </Provider>
                </ErrorBoundary>
            </HashRouter>
        );
    }
}
