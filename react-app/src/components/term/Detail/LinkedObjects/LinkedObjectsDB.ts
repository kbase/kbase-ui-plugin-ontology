import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../../lib/DB';
import { OntologyReference } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel, { RelatedObject } from '../../lib/model';

export type LinkedObjectsDBStateNone = DBStateNone;
export type LinkedObjectsDBStateLoading = DBStateLoading;
export type LinkedObjectsDBStateError = DBStateError;

export interface LinkedObjectsDBStateLoaded extends DBStateLoaded {
    linkedObjects: Array<RelatedObject>;
    totalCount: number;
}

export type LinkedObjectsDBState = LinkedObjectsDBStateNone | LinkedObjectsDBStateLoading | LinkedObjectsDBStateError | LinkedObjectsDBStateLoaded;

export interface LinkedObjectsProps extends DBProps<LinkedObjectsDBState> {
    token: string;
    config: AppConfig;
}

export default class LinkedObjectsDB extends DB<LinkedObjectsDBState> {
    props: LinkedObjectsProps;
    constructor(props: LinkedObjectsProps) {
        super(props);
        this.props = props;

    }
    async getLinkedObjects(termRef: OntologyReference, offset: number, limit: number) {
        const client = new OntologyModel({
            url: this.props.config.services.ServiceWizard.url,
            relationEngineURL: this.props.config.services.RelationEngine.url,
            workspaceURL: this.props.config.services.Workspace.url,
            token: this.props.token,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });
        try {
            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADING
                };
            });

            const linkedObjects = await client.getRelatedObjects({
                ref: termRef,
                // TODO: provided by table ui
                offset,
                limit
            });

            // do the call here when it is available

            this.set((state: LinkedObjectsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    linkedObjects: linkedObjects.objects,
                    totalCount: linkedObjects.totalCount
                };
            });
        } catch (ex) {
            this.set((state: LinkedObjectsDBState) => {
                return {
                    status: DBStatus.ERROR,
                    error: {
                        code: 'not-found',
                        source: 'LinkedObjectsDB.getLinkedObjects',
                        message: ex.message
                    }
                };
            });
        }
    }

}
