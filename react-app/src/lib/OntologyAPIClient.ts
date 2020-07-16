import { DynamicServiceClient } from "@kbase/ui-lib";

export interface GetParentsParams {
    ns: Namespace;
    id: string;
    ts: number;
}

// TODO: this should not live here, or should just be a string?
export type Namespace = 'go_ontology' | 'envo_ontology';

export interface GetParentsResult {
    results: Array<RelatedTerm>;
    ns: Namespace;
    ts: number;
}

export interface GetChildrenParams {
    ns: Namespace;
    id: string;
    ts: number;
}

export interface GetChildrenResult {
    results: Array<RelatedTerm>;
    ns: Namespace;
    ts: number;
}

export interface Synonym {
    pred: string;
    val: string;
    xrefs: Array<XRef>;
}

export interface XRef {
    val: string;
}

// export interface Termx {
//     ns: string;
//     id: string;
//     ts: number;
//     name: string;
//     scientific_name: string;
//     relation: string;
//     synonyms: Array<Synonym>;
//     goID?: string;
//     commnent: string;
//     definition: string;
// }

// doesn't include the underscore fields
// TODO: the api should not return any underscore
// fields.
export interface TermNode {
    namespace: string;
    id: string;
    alt_ids: Array<string>;
    name: string;
    comments: Array<string>;
    def: {
        val: string;
        xrefs: Array<XRef>;
    } | null;
    created: number;
    expired: number;
    subsets: Array<string>;
    synonyms: Array<Synonym>;
    type: string;
    xrefs: Array<XRef>;

    first_version: string;
    last_version: string;
    release_created: number;
    release_expired: number;
}

// aka relation
/*
 case 'is_a':
            return OntologyRelation.IS_A;
        case 'part_of':
            return OntologyRelation.PART_OF;
        case 'has_part':
            return OntologyRelation.HAS_PART;
        case 'regulates':
            return OntologyRelation.REGULATES;
        case 'positively_regulates':
            return OntologyRelation.POSITIVELY_REGULATES;
        case 'negatively_regulates':
            return OntologyRelation.NEGATIVELY_REGULATES;
        case 'occurs_in':
            return OntologyRelation.OCCURS_IN;
        case 'ends_during':
            return OntologyRelation.ENDS_DURING;
        case 'happens_during':
            return OntologyRelation.HAPPENS_DURING;
*/
export type EdgeType = 'is_a' | 'part_of' | 'has_part' | 'regulates' | 'positively_regulates' |
    'negatively_regulates' | 'occurs_in' | 'ends_during' | 'happens_during' | 'derives_from' |
    'has_output' | 'has_input' | 'output_of' | 'input_of' | 'determines' | 'surrounded_by' |
    'has_quality' | 'adjacent_to' | 'overlaps' | 'composed_primarily_of';

export interface TermEdge {
    id: string;
    type: EdgeType;
    created: number;
    expired: number;
    first_version: string;
    last_version: string;
    from: string;
    to: string;
    release_created: number;
    release_expired: number;
}

export interface RelatedTerm {
    term: TermNode;
    edge: TermEdge;
}

// export interface TermBrief {
//     ns: Namespace;
//     id: string;
//     ts: number;
//     name: string;
//     scientific_name: string;
//     relation: string;
// }

export type TermBrief = TermNode;

export interface GetTermsParams {
    ids: Array<string>;
    ts: number;
    ns: Namespace;
}

export interface GetTermsResult {
    results: Array<TermNode>;
    ts: number;
    ns: string;
    // ignore the stats
}

export interface GetRelatedObjectsParams {
    ns: string;
    id: string;
    ts: number;
}

export interface GetRelatedObjectsResult {

}

export interface GetHierarchicalAncestorsParams {
    ns: Namespace;
    id: string;
    ts: number;
    offset: number;
    limit: number;
}

export interface GetHierarchicalAncestorsResult {
    results: Array<RelatedTerm>;
    ns: Namespace;
    ts: number;
}

export interface GetAssociatedWSObjectsParams {
    id: string,
    ns: Namespace,
    ts: number,
    offset: number,
    limit: number;
}

export interface RelatedWSObject {
    feature_count: number,
    ws_obj: {
        name: string,
        workspace_id: number;
        object_id: number;
        version: number;
    };
}

export interface GetAssociatedWSObjectsResults {
    results: Array<RelatedWSObject>;
    total_count: number;
    ns: string;
    ts: number;
    stats: any;
}

export default class OntologyAPIClient extends DynamicServiceClient {
    static module: string = 'OntologyAPI';

    async get_parents(params: GetParentsParams): Promise<GetParentsResult> {
        const [result] = await this.callFunc<[GetParentsParams], [GetParentsResult]>('get_parents', [
            params
        ]);
        return result;
    }

    async get_terms(params: GetTermsParams): Promise<GetTermsResult> {
        const [result] = await this.callFunc<[GetTermsParams], [GetTermsResult]>('get_terms', [
            params
        ]);
        return result;
    }

    async get_children(params: GetChildrenParams): Promise<GetChildrenResult> {
        const [result] = await this.callFunc<[GetChildrenParams], [GetChildrenResult]>('get_children', [
            params
        ]);
        return result;
    }

    async get_hierarchical_ancestors(params: GetHierarchicalAncestorsParams): Promise<GetHierarchicalAncestorsResult> {
        const [result] = await this.callFunc<[GetHierarchicalAncestorsParams], [GetHierarchicalAncestorsResult]>('get_hierarchical_ancestors', [
            params
        ]);
        return result;
    }

    async get_associated_ws_objects(params: GetAssociatedWSObjectsParams): Promise<GetAssociatedWSObjectsResults> {
        const [result] = await this.callFunc<[GetAssociatedWSObjectsParams], [GetAssociatedWSObjectsResults]>('get_associated_ws_objects', [
            params
        ]);
        return result;
    }
}
