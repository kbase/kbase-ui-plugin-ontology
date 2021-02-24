import { DynamicServiceClient } from "@kbase/ui-lib";
import { Sample } from "./Sample";
import sourcesData from './sources.json';

const SOURCES = sourcesData as Array<Source>;

export interface SourceMap {
    [id: string]: Source;
}

export type SourceFieldDataType = 'string' | 'number' | 'boolean' | 'array<string>' | 'array<synonym>' | 'sequence';

export interface SourceFieldDefinition {
    id: string;
    type: SourceFieldDataType;
    label: string;
    tooltip: string;
    description: string;
}

export interface Source {
    namespace: string;
    data_url: string;
    home_url: string;
    logo_url: string;
    license: {
        url: string;
        label: string;
    } | null;
    item_link: {
        template: string;
        label: string;
    } | null;
    citation: string;
    title: string;
    short_title: string;
    fields: Array<SourceFieldDefinition>;
}


// const SOURCES_MAP = SOURCES.reduce<SourceMap>((map, source) => {
//     map[source.id] = source;
//     return map;
// }, {});

const SOURCES_NAMESPACE_MAP = SOURCES.reduce<Map<string, Source>>((map, source) => {
    map.set(source.namespace, source);
    return map;
}, new Map());

export interface GetParentsParams {
    ns: Namespace;
    id: string;
    ts: number;
}

// TODO: this should not live here, or should just be a string?
export type Namespace = string;

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

export interface Synonym {
    pred: string;
    val: string;
    xrefs: Array<XRef>;
}

export type EdgeType = string;

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

export interface GetAssociatedWSGenomesParams {
    id: string,
    ns: Namespace,
    ts: number,
    offset: number,
    limit: number;
}

export interface GetAssociatedWSGenomesResults {
    results: Array<RelatedWSObject>;
    total_count: number;
    ns: string;
    ts: number;
    stats: any;
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

export interface GetAssociatedWSFeaturesParams {
    id: string,
    obj_ref: string;
    ns: Namespace,
    ts?: number,
    offset?: number,
    limit?: number;
}

export interface RelatedWSFeature {
    feature_id: string;
    updated_at: number;
}

export interface RelatedWSObjectFeatures {
    ws_obj: {
        name: string,
        workspace_id: number;
        object_id: number;
        version: number;
    };
    features: Array<RelatedWSFeature>;
}

export interface GetAssociatedWSFeaturesResults {
    results: Array<RelatedWSObjectFeatures>;
    total_count: number;
    ns: string;
    ts: number;
    stats: any;
}

export interface GetAssociatedSamplesParams {
    id: string,
    ns: Namespace,
    ts: number,
    offset: number,
    limit: number;
}

export interface SampleResult {
    sample_metadata_key: string;
    sample: Sample;
}

export interface GetAssociatedSamplesResults {
    results: Array<SampleResult>;
    total_accessible_count: number;
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

    async get_associated_ws_genomes(params: GetAssociatedWSGenomesParams): Promise<GetAssociatedWSGenomesResults> {
        const [result] = await this.callFunc<[GetAssociatedWSGenomesParams], [GetAssociatedWSGenomesResults]>('get_associated_ws_genomes', [
            params
        ]);
        return result;
    }

    async get_associated_ws_features(params: GetAssociatedWSFeaturesParams): Promise<GetAssociatedWSFeaturesResults> {
        const [result] = await this.callFunc<[GetAssociatedWSFeaturesParams], [GetAssociatedWSFeaturesResults]>('get_associated_ws_features', [
            params
        ]);
        return result;
    }

    async get_associated_samples(params: GetAssociatedSamplesParams): Promise<GetAssociatedSamplesResults> {
        const [result] = await this.callFunc<[GetAssociatedSamplesParams], [GetAssociatedSamplesResults]>('get_associated_samples', [
            params
        ]);
        return result;
    }

    async get_sources(): Promise<Array<Source>> {
        return Promise.resolve(SOURCES);
    }

    async get_source({ ns }: { ns: string; }): Promise<Source | null> {
        const source = SOURCES_NAMESPACE_MAP.get(ns) || null;
        return Promise.resolve(source);
    }
}
