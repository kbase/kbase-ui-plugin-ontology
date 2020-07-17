import React from 'react';
import LinkedObjectsDB, { LinkedObjectsDBStateLoaded, SortKey, SortDirection } from './LinkedObjectsDB';
import { DBStatus, DBStateError } from '../../../lib/DB';

import { AppConfig } from '@kbase/ui-components';
import View from './view';
import { OntologyReference } from '../../../types/ontology';
import ErrorView from '../../ErrorView';
import Loading from '../../Loading';
import { RelatedObject } from '../lib/model';

export interface Props {
    token: string;
    config: AppConfig;
    termRef: OntologyReference;
}

interface State {
    selectedObjectRef: string | null;
}

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
        this.state = {
            selectedObjectRef: null
        };
    }

    async componentDidMount() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                // TODO: refactor this whole business...
                await this.db.getLinkedObjects(this.props.termRef, this.offset, this.limit);
                this.sortObjects('name', 'ascending');
        }
    }

    renderLoading() {
        return <Loading message="Loading linked data..." />;
    }

    renderError(db: DBStateError) {
        return <ErrorView error={db.error} />;
    }

    async selectObject(ref: string) {
        this.setState({
            selectedObjectRef: ref
        });
    }

    sortObjects(sortBy: SortKey, direction: SortDirection) {
        const dir = direction === 'ascending' ? 1 : -1;
        console.log('sorting?', sortBy, direction);
        this.db.sortLinkedObjects((a: RelatedObject, b: RelatedObject) => {
            switch (sortBy) {
                case 'name':
                    return dir * a.name.localeCompare(b.name);
                case 'featureCount':
                    return dir * (a.featureCount - b.featureCount);
                default:
                    return 0;
            }
        });
    }

    renderLoaded(db: LinkedObjectsDBStateLoaded) {
        return (
            <View
                linkedObjects={db.linkedObjects}
                totalCount={db.totalCount}
                selectObject={this.selectObject.bind(this)}
                selectedObjectRef={this.state.selectedObjectRef}
                termRef={this.props.termRef}
                sortObjects={this.sortObjects.bind(this)}
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
