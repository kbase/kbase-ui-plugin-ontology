import DB, { DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError } from '../../../../lib/DB';
import { OntologyReference, OntologyRelatedTerm } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel from '../lib/model';

export type ParentsDBStateNone = DBStateNone;
export type ParentsDBStateLoading = DBStateLoading;
export type ParentsDBStateError = DBStateError;
export interface ParentsDBStateLoaded extends DBStateLoaded {
    terms: Array<OntologyRelatedTerm>;
}

export type ParentsDBState = ParentsDBStateNone | ParentsDBStateLoading | ParentsDBStateLoaded | ParentsDBStateError;

export interface ParentsDBProps extends DBProps<ParentsDBState> {
    token: string;
    config: AppConfig;
}

export default class ParentsDB extends DB<ParentsDBState> {
    props: ParentsDBProps;
    constructor(props: ParentsDBProps) {
        super(props);
        this.props = props;
    }

    async getChildrenTerms(termRef: OntologyReference) {
        this.set((state: ParentsDBState) => {
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

        try {

            const { terms } = await client.getChildren({
                ref: termRef
            });

            terms.sort((a: OntologyRelatedTerm, b: OntologyRelatedTerm) => {
                return a.term.name.localeCompare(b.term.name);
            });

            this.set((state: ParentsDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    terms: terms
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: ParentsDBState) => {
                return {
                    ...state,
                    status: DBStatus.ERROR,
                    error: ex.message
                };
            });
        }
    }

}