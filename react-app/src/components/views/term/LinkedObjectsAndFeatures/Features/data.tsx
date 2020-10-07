import React from 'react';
import { AppConfig } from '@kbase/ui-components';
import View from './view';
import Loading from '../../../../Loading';
import { OntologyReference } from '../../../../../types/ontology';
import { AsyncProcess, AsyncProcessStatus } from '../../../../../lib/processing';
import OntologyModel, { Feature, RelatedObject } from '../../lib/model';
import Alert from 'antd/lib/alert';

export interface DataProps {
    token: string;
    config: AppConfig;
    termRef: OntologyReference;
    object: RelatedObject;
}

interface SimpleError {
    message: string;
}

interface State {
    features: Array<Feature>;
}

interface DataState {
    process: AsyncProcess<State, SimpleError>;
}

export default class Data extends React.Component<DataProps, DataState> {
    // db: LinkedObjectsDB;
    offset: number;
    limit: number;
    constructor(props: DataProps) {
        super(props);

        this.offset = 0;
        this.limit = 1000;
        this.state = {
            process: {
                status: AsyncProcessStatus.NONE
            }
        };
    }

    async componentDidMount() {
        const client = new OntologyModel({
            token: this.props.token,
            url: this.props.config.services.ServiceWizard.url,
            workspaceURL: this.props.config.services.Workspace.url,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });

        try {
            const { features } = await client.getRelatedObjectFeatures({
                ref: this.props.termRef,
                objectRef: this.props.object.ref,
                offset: this.offset,
                limit: this.limit,
                featureCount: this.props.object.featureCount
            });
            this.setState({
                process: {
                    status: AsyncProcessStatus.SUCCESS,
                    state: {
                        features
                    }
                }
            });
        } catch (ex) {
            this.setState({
                process: {
                    status: AsyncProcessStatus.ERROR,
                    error: {
                        message: ex.message
                    }
                }
            });
        }
    }

    renderLoading() {
        return <Loading message="Loading features..." />;
    }

    renderError(error: SimpleError) {
        return <Alert type="error" message={error.message} />;
    }

    renderLoaded(state: State) {
        return (
            <View
                features={state.features}
                objectRef={this.props.object.ref}
            />
        );
    }

    render() {

        switch (this.state.process.status) {
            case AsyncProcessStatus.NONE:
                return this.renderLoading();
            case AsyncProcessStatus.PROCESSING:
                return this.renderLoading();
            case AsyncProcessStatus.ERROR:
                return this.renderError(this.state.process.error);
            case AsyncProcessStatus.SUCCESS:
                return this.renderLoaded(this.state.process.state);
        }
    }
}
