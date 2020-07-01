import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '@kbase/ui-components';
import { Dispatcher } from './view';
import { navigate } from '../../redux/actions';
import { StoreState, Navigation } from '../../redux/store';

interface OwnProps { }

interface StateProps {
    token: string | null;
    rootState: RootState;
    navigation: Navigation;
    trigger: number;
}

interface DispatchProps {
    navigate: (navigation: Navigation) => void;
    // view: (view: View) => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        auth: { userAuthorization },
        root: { state: rootState },
        navigation,
        trigger
    } = state;

    // Auth integration.
    let token;
    if (!userAuthorization) {
        token = null;
    } else {
        token = userAuthorization.token;
    }

    return { token, rootState, navigation, trigger };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        navigate: (navigation: Navigation) => {
            dispatch(navigate(navigation) as any);
        },
        // view: (view: View) => {
        //     dispatch(view(view) as any)
        // }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Dispatcher);
