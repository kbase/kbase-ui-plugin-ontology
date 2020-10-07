import { DynamicServiceClient } from "@kbase/ui-lib";

const SOURCES: Array<Source> = [
    {
        id: 'go',
        namespace: 'go_ontology',
        data_url: 'http://release.geneontology.org/',
        home_url: 'http://geneontology.org/',
        logo_url: 'https://ci.kbase.us/ui-assets/images/third-party-data-sources/go/logo-248-64.png',
        title: 'Gene Ontology',
        fields: [{
            id: 'synonyms',
            type: 'array<synonym>',
            label: 'Synonyms',
            tooltip: '',
            description: ''
        }],
        term_url: 'http://amigo.geneontology.org/amigo/term/{{term}}',
        term_url_label: 'Gene Ontology AmiGO',
    }, {
        id: 'envo',
        namespace: 'envo_ontology',
        data_url: 'https://github.com/EnvironmentOntology/envo/releases',
        home_url: 'http://www.obofoundry.org/ontology/envo.html',
        logo_url: 'https://ci.kbase.us/ui-assets/images/third-party-data-sources/envo/logo-119-64.png',
        term_url: 'http://purl.obolibrary.org/obo/{{term}}',
        term_url_label: 'ENVO Ontology Ontobee',
        title: 'GTDB Taxonomy',
        fields: []
    }
];

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
    id: string;
    namespace: string;
    data_url: string;
    home_url: string;
    logo_url: string;
    term_url: string;
    term_url_label: string;
    title: string;
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

    async get_associated_ws_features(params: GetAssociatedWSFeaturesParams): Promise<GetAssociatedWSFeaturesResults> {
        const [result] = await this.callFunc<[GetAssociatedWSFeaturesParams], [GetAssociatedWSFeaturesResults]>('get_associated_ws_features', [
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
