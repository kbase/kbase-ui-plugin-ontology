import DB, {
    DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError
} from '../../../lib/DB';
import { OntologyReference, OntologyItem } from '../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel, { DataSourceInfo } from '../lib/model';

export type OntologyDBStateNone = DBStateNone;
export type OntologyDBStateLoading = DBStateLoading;
export type OntologyDBStateError = DBStateError;
export interface OntologyDBStateLoaded extends DBStateLoaded {
    targetItem: OntologyItem;
    selectedItem: OntologyItem;
    dataSourceInfo: DataSourceInfo;
}

export type OntologyDBState = OntologyDBStateNone | OntologyDBStateLoading | OntologyDBStateLoaded | OntologyDBStateError;

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
            relationEngineURL: this.props.config.services.RelationEngine.url,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });

        try {
            const { term } = await client.getTerm({
                ref: termRef
            });

            const dataSourceInfo = await client.getDataSourceInfo(termRef.namespace);

            this.set((state: OntologyDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    targetItem: term,
                    selectedItem: term,
                    dataSourceInfo
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: OntologyDBState) => {
                return {
                    ...state,
                    status: DBStatus.ERROR,
                    error: ex.message
                };
            });
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
            relationEngineURL: this.props.config.services.RelationEngine.url,
            ontologyAPIConfig: this.props.config.dynamicServices.OntologyAPI
        });

        const { term } = await client.getTerm({ ref: termRef });

        this.set((state: OntologyDBState) => {
            return {
                ...state,
                selectedTerm: term
            };
        });
    }
}