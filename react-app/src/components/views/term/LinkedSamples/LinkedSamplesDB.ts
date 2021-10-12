import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../../lib/DB';
import { OntologyReference } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel, { RelatedSample } from '../lib/model';

export type LinkedSamplesDBStateNone = DBStateNone;
export type LinkedSamplesDBStateLoading = DBStateLoading;
export type LinkedSamplesDBStateError = DBStateError;

export interface LinkedSamplesDBStateLoaded extends DBStateLoaded {
    linkedSamples: Array<RelatedSample>;
    totalAccessibleCount: number;
    totalCount: number;
}

export type LinkedSamplesDBState = LinkedSamplesDBStateNone | LinkedSamplesDBStateLoading | LinkedSamplesDBStateError | LinkedSamplesDBStateLoaded;

export interface LinkedSamplesProps extends DBProps<LinkedSamplesDBState> {
    token: string;
    config: AppConfig;
}

export default class LinkedSamplesDB extends DB<LinkedSamplesDBState> {
    props: LinkedSamplesProps;
    constructor(props: LinkedSamplesProps) {
        super(props);
        this.props = props;

    }
    async getLinkedSamples(termRef: OntologyReference, offset: number, limit: number) {
        const client = new OntologyModel({
            url: this.props.config.services.ServiceWizard.url,
            workspaceURL: this.props.config.services.Workspace.url,
            token: this.props.token,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });
        try {
            this.set((state: LinkedSamplesDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const linkedSamples = await client.getRelatedSamples({
                ref: termRef,
                // TODO: provided by table ui
                offset,
                limit
            });

            // do the call here when it is available

            this.set((state: LinkedSamplesDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    linkedSamples: linkedSamples.samples,
                    totalAccessibleCount: linkedSamples.totalAccessibleCount,
                    totalCount: linkedSamples.totalCount
                };
            });
        } catch (ex) {
            this.set((state: LinkedSamplesDBState) => {
                return {
                    status: DBStatus.ERROR,
                    error: {
                        code: 'not-found',
                        source: 'LinkedSamplesDB.getLinkedSamples',
                        message: ex instanceof Error ? ex.message : 'Unknown error',
                    }
                };
            });
        }
    }

}
