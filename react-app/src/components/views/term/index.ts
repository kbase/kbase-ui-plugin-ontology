import { StoreState } from '../../../redux/store';
import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import Main from './Main';
import { sendTitle } from '@kbase/ui-components';

export interface OwnProps {
}

export interface StateProps {
}

export interface DispatchProps {
    setTitle: (title: string) => void;
}

function mapStateToProps(state: StoreState, ownProps: OwnProps): StateProps {
    return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        setTitle: (title: string) => {
            dispatch(sendTitle(title) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Main);
