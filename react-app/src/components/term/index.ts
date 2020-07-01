import { StoreState, Navigation } from '../../redux/store';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { navigate } from '../../redux/actions';
import { connect } from 'react-redux';
import Main from './Main';
import { sendTitle } from '@kbase/ui-components';

export interface OwnProps {
}

export interface StateProps {
}

export interface DispatchProps {
    navigate: (navigation: Navigation) => void;
    setTitle: (title: string) => void;
}

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        navigate: (navigation: Navigation) => {
            dispatch(navigate(navigation) as any);
        },
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Main);
