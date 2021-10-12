import DB, {
    DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError
} from '../../../../lib/DB';
import {OntologyReference, OntologyTermRecord} from '../../../../types/ontology';
import {AppConfig} from '@kbase/ui-components';
import OntologyModel from '../lib/model';
import {Source} from '../../../../lib/OntologyAPIClient';
import {UIError, UIException} from "../../../../types/error";

export type OntologyDBStateNone = DBStateNone;
export type OntologyDBStateLoading = DBStateLoading;
export type OntologyDBStateError = DBStateError;

export interface OntologyDBStateLoaded extends DBStateLoaded {
    targetItem: OntologyTermRecord;
    selectedItem: OntologyTermRecord;
    source: Source;
}

export type OntologyDBState =
    OntologyDBStateNone
    | OntologyDBStateLoading
    | OntologyDBStateLoaded
    | OntologyDBStateError;

export interface OntologyDBProps extends DBProps<OntologyDBState> {
    token: string;
    config: AppConfig;
}

export default class OntologyDB extends DB<OntologyDBState> {
    props: OntologyDBProps;

    constructor(props: OntologyDBProps) {
        super(props);
        this.props = props;
    }

    async getTargetTerm(termRef: OntologyReference) {
        this.set((state: OntologyDBState) => {
            return {
                ...state,
                status: DBStatus.LOADING
            };
        });

        const client = new OntologyModel({
            token: this.props.token,
            url: this.props.config.services.ServiceWizard.url,
            workspaceURL: this.props.config.services.Workspace.url,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });

        // const client = new OntologyAPIClient({
        //     token: this.props.token,
        //     url: this.props.config.services.ServiceWizard.url,
        //     version: this.props.config.dynamicServices.OntologyAPI.version
        // });

        try {
            const source = await client.getSource(termRef.namespace);

            if (source === null) {
                console.log('umm');
                throw new UIException({
                    message: `data source not found for namespace "${termRef.namespace}"`,
                    code: 'namespace-not-found',
                    source: 'OntologyAPI',
                    data: {
                        termRef
                    }
                })
            }

            const {term} = await client.getTerm({
                ref: termRef
            });


            this.set((state: OntologyDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    targetItem: term,
                    selectedItem: term,
                    source
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            if (ex instanceof UIException) {
                const error = ex.getError();
                this.set((state: OntologyDBState) => {
                    return {
                        ...state,
                        status: DBStatus.ERROR,
                        error
                    };
                });
            } else {
                this.set((state: OntologyDBState) => {
                    const error: UIError = {
                        code: 'dberror',
                        source: 'OntologyDB',
                        message: ex instanceof Error ? ex.message : 'Unknown error',
                    }
                    return {
                        ...state,
                        status: DBStatus.ERROR,
                        error
                    };
                });
            }
        }
    }

    async setSelectedTerm(termRef: OntologyReference) {
        const state = this.get();

        if (state.status !== DBStatus.LOADED) {
            return;
        }

        const client = new OntologyModel({
            token: this.props.token,
            url: this.props.config.services.ServiceWizard.url,
            workspaceURL: this.props.config.services.Workspace.url,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });

        const {term} = await client.getTerm({ref: termRef});

        this.set((state: OntologyDBState) => {
            return {
                ...state,
                selectedTerm: term
            };
        });
    }
}