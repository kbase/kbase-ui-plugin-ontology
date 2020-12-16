import DB, {
    DBProps, DBStatus, DBStateNone, DBStateLoading,
    DBStateLoaded, DBStateError, DBStateReLoading
} from '../../../../lib/DB';
import { OntologyReference } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel, { Feature, RelatedGenome } from '../lib/model';

export type SortKey = 'name' | 'featureCount';
export type SortDirection = 'ascending' | 'descending';

export type LinkedObjectsDBStateNone = DBStateNone;
export type LinkedObjectsDBStateLoading = DBStateLoading;
export type LinkedObjectsDBStateError = DBStateError;

export interface LinkedObjectsDBStateLoaded extends DBStateLoaded {
    linkedObjects: Array<RelatedGenome>;
    selectedObject: RelatedGenome | null;
    features: Array<Feature> | null;
    totalCount: number;
}

export interface LinkedObjectsDBStateReLoading extends DBStateReLoading {
    linkedObjects: Array<RelatedGenome>;
    selectedObject: RelatedGenome | null;
    features: Array<Feature> | null;
    totalCount: number;
}

export type LinkedObjectsDBState = LinkedObjectsDBStateNone | LinkedObjectsDBStateLoading | LinkedObjectsDBStateError | LinkedObjectsDBStateLoaded | LinkedObjectsDBStateReLoading;

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
    async getLinkedGenomes(termRef: OntologyReference, offset: number, limit: number) {
        const client = new OntologyModel({
            url: this.props.config.services.ServiceWizard.url,
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

            const linkedObjects = await client.getRelatedGenomes({
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
                    totalCount: linkedObjects.totalCount,
                    selectedObject: null,
                    features: null
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

    sortLinkedObjects(sorter: (a: RelatedGenome, b: RelatedGenome) => number) {
        // const db = this.get();
        // if (db.status !== DBStatus.LOADED) {
        //     return;
        // }
        // const sorted = db.linkedObjects.sort(sorter);
        this.set((state: LinkedObjectsDBState) => {
            if (state.status !== DBStatus.LOADED) {
                return state;
            }
            return {
                ...state,
                linkedObjects: state.linkedObjects.sort(sorter)
            };
        });
    }

    // async getFeatures(termRef: OntologyReference, objectRef: string, offset: number, limit: number) {
    //     const client = new OntologyModel({
    //         url: this.props.config.services.ServiceWizard.url,
    //         relationEngineURL: this.props.config.services.RelationEngine.url,
    //         workspaceURL: this.props.config.services.Workspace.url,
    //         token: this.props.token,
    //         ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
    //     });
    //     try {
    //         this.set((state: LinkedObjectsDBState) => {
    //             if (state.status !== DBStatus.LOADED) {
    //                 return state;
    //             }
    //             return {
    //                 ...state,
    //                 status: DBStatus.RELOADING
    //             };
    //         });

    //         const linkedObjectFeatures = await client.getRelatedObjectFeatures({
    //             ref: termRef,
    //             objectRef,
    //             // TODO: provided by table ui
    //             offset,
    //             limit
    //         });

    //         // do the call here when it is available

    //         this.set((state: LinkedObjectsDBState) => {
    //             if (state.status !== DBStatus.LOADED) {
    //                 return state;
    //             }
    //             return {
    //                 ...state,
    //                 status: DBStatus.LOADED,
    //                 selectedObject: linkedObjectFeatures.object,
    //                 features: linkedObjectFeatures.features
    //             };
    //         });
    //     } catch (ex) {
    //         this.set((state: LinkedObjectsDBState) => {
    //             return {
    //                 status: DBStatus.ERROR,
    //                 error: {
    //                     code: 'not-found',
    //                     source: 'LinkedObjectsDB.getLinkedObjects',
    //                     message: ex.message
    //                 }
    //             };
    //         });
    //     }
    // }

}
