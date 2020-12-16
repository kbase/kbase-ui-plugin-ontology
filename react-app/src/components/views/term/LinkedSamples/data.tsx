import React from 'react';
import LinkedObjectsDB, { LinkedSamplesDBStateLoaded } from './LinkedSamplesDB';
import { DBStatus, DBStateError } from '../../../../lib/DB';

import { AppConfig } from '@kbase/ui-components';
import View from './view';
import { OntologyReference } from '../../../../types/ontology';
import ErrorView from '../../../ErrorView';
import Loading from '../../../Loading';

export interface Props {
    token: string;
    config: AppConfig;
    termRef: OntologyReference;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: LinkedObjectsDB;
    offset: number;
    limit: number;
    constructor(props: Props) {
        super(props);
        this.db = new LinkedObjectsDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                status: DBStatus.NONE
            },
            token: props.token,
            config: props.config
        });
        this.offset = 0;
        this.limit = 1000;
    }

    componentDidMount() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                this.db.getLinkedSamples(this.props.termRef, this.offset, this.limit);
        }
    }

    renderLoading() {
        return <Loading message="Loading linked genomes..." />;
    }

    renderError(db: DBStateError) {
        return <ErrorView error={db.error} />;
    }

    renderLoaded(db: LinkedSamplesDBStateLoaded) {
        return (
            <View
                linkedSamples={db.linkedSamples} totalCount={db.totalCount}
            />
        );
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
        }
    }
}
