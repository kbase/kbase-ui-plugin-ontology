import { Dispatch } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';
import { StoreState, OntologyAppData } from '../../redux/store';
import View from './view';
import { AppError } from '@kbase/ui-components';
import { AsyncProcess } from '../../lib/processing';
import { loadData } from '../../redux/actions';

interface OwnProps { }

interface StateProps {
    data: AsyncProcess<OntologyAppData, AppError>;
}

interface DispatchProps {
    loadData: () => void;
}

function mapStateToProps(state: StoreState, props: OwnProps): StateProps {
    const {
        ontlologyPlugin: {
            data
        }
    } = state;

    return { data };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {
        // navigate: (navigation: Navigation) => {
        //     dispatch(navigate(navigation) as any);
        // },
        loadData: () => {
            dispatch(loadData() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, StoreState>(
    mapStateToProps,
    mapDispatchToProps
)(View);
