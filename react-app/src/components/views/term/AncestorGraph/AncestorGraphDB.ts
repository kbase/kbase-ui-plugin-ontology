import DB, {
    DBProps, DBStatus, DBStateNone, DBStateLoading, DBStateLoaded, DBStateError
} from '../../../../lib/DB';
import { OntologyReference, OntologyTermRecord } from '../../../../types/ontology';
import { AppConfig } from '@kbase/ui-components';
import OntologyModel, { TermsGraph, TermsGraphNode } from '../lib/model';

export type AncestorGraphDBStateNone = DBStateNone;
export type AncestorGraphDBStateLoading = DBStateLoading;
export type AncestorGraphDBStateError = DBStateError;
export interface AncestorGraphDBStateLoaded extends DBStateLoaded {
    graph: TermsGraph;
    term: OntologyTermRecord;
}

export type AncestorGraphDBState = AncestorGraphDBStateNone | AncestorGraphDBStateLoading | AncestorGraphDBStateLoaded | AncestorGraphDBStateError;

export interface AncestorGraphDBProps extends DBProps<AncestorGraphDBState> {
    token: string;
    config: AppConfig;
}

export default class AncestorGraphDB extends DB<AncestorGraphDBState> {
    props: AncestorGraphDBProps;
    constructor(props: AncestorGraphDBProps) {
        super(props);
        this.props = props;
    }

    async getAncestorGraph(termRef: OntologyReference) {
        this.set((state: AncestorGraphDBState) => {
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

            const { term } = await client.getTerm({
                ref: termRef
            });

            const { termsGraph } = await client.getAncestorGraph({
                ref: termRef
            });

            // Here we add the term of focus as a node in the graph, to make sure it roots at it.
            const node: TermsGraphNode = {
                id: term.ref.term,
                isRoot: false,
                term
            };

            termsGraph.terms.push(node);

            this.set((state: AncestorGraphDBState) => {
                return {
                    ...state,
                    status: DBStatus.LOADED,
                    graph: termsGraph,
                    term
                };
            });
        } catch (ex) {
            console.error('ERROR', ex);
            this.set((state: AncestorGraphDBState) => {
                return {
                    ...state,
                    status: DBStatus.ERROR,
                    error: {
                        code: 'error',
                        source: 'ancestor-graph-data-fetch',
                        message: ex.message
                    }
                };
            });
        }
    }

}