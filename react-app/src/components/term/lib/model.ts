import OntologyAPIClient, {
    TermNode, RelatedTerm, EdgeType, Namespace
} from '../../../lib/OntologyAPIClient';
import {
    OntologyReference, OntologyNamespace, OntologyTerm, OntologySource,
    GOOntologyTerm, OntologyRelatedTerm, OntologyRelation, stringToOntologyNamespace,
    ENVOOntologyTerm,
    OntologyItem
} from '../../../types/ontology';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import RelationEngineAPIClient from '../../../lib/RelationEngineAPIClient';
import { GenericClient } from '@kbase/ui-lib';

const REQUEST_TIMEOUT = 30000;

// Supporting data types

// TODO: this should be more expansive, but ...
export type RelationEngineDataSource = 'go_ontology' | 'envo_ontology';

function stringToRelationEngineDataSource(s: string): RelationEngineDataSource {
    switch (s) {
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
        default:
            throw new Error(`String cannot map to relation engine data source: ${s}`);
    }
}

export interface DataSourceInfo {
    source: RelationEngineDataSource;
    data_url: string;
    home_url: string;
    logo_url: string;
    title: string;
}

// Method Params and Results

export interface GetTermParams {
    ref: OntologyReference;
}

export interface GetTermResult {
    term: OntologyItem;
}

export interface GetTermsParams {
    refs: Array<OntologyReference>;
}

export interface GetTermsResult {
    terms: Array<OntologyTerm>;
}

export interface GetParentsParams {
    ref: OntologyReference;
}

// TODO: this should be a "related term", although maybe the relation 
// collapses out with ontology - are they all is_a at least for parents, children?
export interface GetParentsResult {
    terms: Array<OntologyRelatedTerm>;
}

export interface GetChildrenParams {
    ref: OntologyReference;
}

// TODO: this should be a "related term", although maybe the relation 
// collapses out with ontology - are they all is_a at least for parents, children?
export interface GetChildrenResult {
    terms: Array<OntologyRelatedTerm>;
}

export interface GetAncestorGraphParams {
    ref: OntologyReference;
}

export interface GetRelatedObjectsParams {
    ref: OntologyReference;
    offset: number;
    limit: number;
}

export interface WorkspaceObjectReference {
    workspaceID: number;
    objectID: number;
    version: number;
}

// export interface RelatedFeature {
//     objectName: string;
//     featureID: string;
//     relatedAt: number;
//     objectRef: WorkspaceObjectReference;
// }

export interface RelatedObject {
    name: string;
    id: number;
    version: number;
    workspaceId: number;
    featureCount: number;
    workspaceType: string;
}

export interface GetRelatedObjectsResult {
    objects: Array<RelatedObject>;
    totalCount: number;
}

export type NodeID = string;

export interface TermsGraphNode {
    term: OntologyItem;
    isRoot: boolean;
    id: NodeID;
}

export interface TermsGraphRelation {
    relation: OntologyRelation;
    from: NodeID;
    to: NodeID;
}

export interface TermsGraph {
    terms: Array<TermsGraphNode>;
    relations: Array<TermsGraphRelation>;
}

export interface GetAncestorGraphResult {
    termsGraph: TermsGraph;
}

export function termNodeToTerm(term: TermNode, ns: string, ts: number): OntologyItem {
    const namespace = stringToOntologyNamespace(ns || 'envo_ontology');

    switch (namespace) {
        case 'go_ontology':
            const goTerm: GOOntologyTerm = {
                type: OntologySource.GO,
                ref: {
                    namespace: 'go_ontology', // TODO: stringToOntologyNamespace(term.ns),
                    term: term.id,
                    timestamp: ts
                },
                namespace: ns,
                comments: term.comments,
                definition: term.def ? term.def.val : 'n/a',
                goID: term.id,
                isObsolete: false, // ignored for now, 
                name: term.name,
                synonyms: {
                    exact: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasExactSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    narrow: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasNarrowSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    broad: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasBroadSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                    related: term.synonyms.filter((synonym) => {
                        return synonym.pred === 'hasRelatedSynonym';
                    }).map((synonym) => {
                        return synonym.val;
                    }),
                }, // TODO:
            };
            return goTerm;
        case 'envo_ontology':
            const envoTerm: ENVOOntologyTerm = {
                type: OntologySource.ENVO,
                ref: {
                    namespace: 'envo_ontology', // TODO: stringToOntologyNamespace(term.ns),
                    term: term.id,
                    timestamp: ts
                },
                namespace: 'envo_ontology',
                comments: term.comments,
                definition: term.def ? term.def.val : 'n/a',
                envoID: term.id,
                isObsolete: false, // ignored for now, 
                name: term.name
            };
            return envoTerm;
        default:
            throw new Error('Ontology namespace not yet supported: ' + namespace);
    }
}

/*
  IS_A = 'OntologyRelation$is_a',
    PART_OF = 'OntologyRelation$part_of',
    HAS_PART = 'OntologyRelation$has_part',
    REGULATES = 'OntologyRelation$regulates',
    POSITIVELY_REGULATES = 'OntologyRelation$positivelyRegulates',
    NEGATIVELY_REGULATES = 'OntologyRelation$negativelyRegulates',
    OCCURS_IN = 'OntologyRelation$occursIn',
    ENDS_DURING = 'OntologyRelation$endsDuring',
    HAPPENS_DURING = 'OntologyRelation$happensDuring'
*/

export function stringToTermRelation(relationString: EdgeType): OntologyRelation {
    switch (relationString) {
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
        case 'derives_from':
            return OntologyRelation.DERIVES_FROM;
        case 'has_output':
            return OntologyRelation.HAS_OUTPUT;
        case 'has_input':
            return OntologyRelation.HAS_INPUT;
        case 'input_of':
            return OntologyRelation.INPUT_OF;
        case 'output_of':
            return OntologyRelation.OUTPUT_OF;
        case 'determines':
            return OntologyRelation.DETERMINES;
        case 'surrounded_by':
            return OntologyRelation.SURROUNDED_BY;
        case 'has_quality':
            return OntologyRelation.HAS_QUALITY;
        case 'adjacent_to':
            return OntologyRelation.ADJACENT_TO;
        case 'overlaps':
            return OntologyRelation.OVERLAPS;
        case 'composed_primarily_of':
            return OntologyRelation.COMPOSED_PRIMARILY_OF;

        default:
            throw new Error('Unknown relation: ' + relationString);
    }
}

export function relationToString(relation: OntologyRelation): EdgeType {
    switch (relation) {
        case OntologyRelation.IS_A:
            return 'is_a';
        case OntologyRelation.PART_OF:
            return 'part_of';
        case OntologyRelation.HAS_PART:
            return 'has_part';
        case OntologyRelation.REGULATES:
            return 'regulates';
        case OntologyRelation.POSITIVELY_REGULATES:
            return 'positively_regulates';
        case OntologyRelation.NEGATIVELY_REGULATES:
            return 'negatively_regulates';
        case OntologyRelation.OCCURS_IN:
            return 'occurs_in';
        case OntologyRelation.ENDS_DURING:
            return 'ends_during';
        case OntologyRelation.HAPPENS_DURING:
            return 'happens_during';
        case OntologyRelation.DERIVES_FROM:
            return 'derives_from';
        case OntologyRelation.HAS_OUTPUT:
            return 'has_output';
        case OntologyRelation.HAS_INPUT:
            return 'has_input';
        case OntologyRelation.OUTPUT_OF:
            return 'output_of';
        case OntologyRelation.INPUT_OF:
            return 'input_of';
        case OntologyRelation.DETERMINES:
            return 'determines';
        case OntologyRelation.SURROUNDED_BY:
            return 'surrounded_by';
        case OntologyRelation.HAS_QUALITY:
            return 'has_quality';
        case OntologyRelation.ADJACENT_TO:
            return 'adjacent_to';
        case OntologyRelation.OVERLAPS:
            return 'overlaps';
        case OntologyRelation.COMPOSED_PRIMARILY_OF:
            return 'composed_primarily_of';
    }
}

export function relatedTermToTerm(relatedTerm: RelatedTerm, namespace: Namespace, ts: number): OntologyRelatedTerm {
    const term = termNodeToTerm(relatedTerm.term, namespace, ts);
    const relation = stringToTermRelation(relatedTerm.edge.type);
    return {
        term, relation
    };
}

export function ontologyReferenceToNamespace(ref: OntologyReference): OntologyNamespace {
    switch (ref.namespace) {
        case 'go_ontology':
            return 'go_ontology';
        case 'envo_ontology':
            return 'envo_ontology';
    }
}

export interface OntologyModelParams {
    token: string;
    url: string;
    relationEngineURL: string;
    workspaceURL: string;
    ontologyAPIConfig: DynamicServiceConfig;
}

export interface GetObjectInfo3Params {
    objects: Array<any>;
    includeMetadata: number;
    ignoreErrors: number;
}

export interface Metadata {
    [key: string]: string;
}

export type ObjectInfo = [
    number, // object id
    string, // object name
    string, // workspace type of object
    string, // timestamp saved
    number, // object version
    string, // username of user who saved
    number, // workspace id
    string, // checksum
    number, // size in bytes
    Metadata, // metadata
];

export interface GetObjectInfo3Result {
    infos: Array<ObjectInfo>;
    paths: Array<Array<string>>;
}

export default class OntologyModel {
    ontologyClient: OntologyAPIClient;
    token: string;
    url: string;
    relationEngineURL: string;
    workspaceURL: string;
    ontologyAPIConfig: DynamicServiceConfig;
    constructor({ token, url, ontologyAPIConfig, relationEngineURL, workspaceURL }: OntologyModelParams) {
        this.token = token;
        this.url = url;
        this.relationEngineURL = relationEngineURL;
        this.workspaceURL = workspaceURL;
        this.ontologyAPIConfig = ontologyAPIConfig;
        this.ontologyClient = new OntologyAPIClient({
            token,
            url,
            timeout: REQUEST_TIMEOUT,
            version: ontologyAPIConfig.version
        });
    }

    // async getTerms({ refs }: GetTermsParams): Promise<GetTermsResult> {
    //     const client = new OntologyAPIClient({
    //         token: this.token,
    //         url: this.url
    //     });

    //     if (refs.length === 0) {
    //         return { terms: [] };
    //     }

    //     const ns = ontologyNamespaceToString(refs[0].namespace);
    //     const ids = refs.map(({ id }))

    //     const result = await client.getTerms({
    //         ns,
    //         ids: [ref.id],
    //         ts: ref.timestamp
    //     })

    //     return {
    //         term: rawTermToTerm(result.term, result.ts)
    //     };

    // }

    async getTerm({ ref }: { ref: OntologyReference; }): Promise<GetTermResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const namespace = ontologyReferenceToNamespace(ref);

        const result = await client.get_terms({
            ns: namespace,
            ids: [ref.term],
            ts: ref.timestamp || Date.now()
        });

        return {
            term: termNodeToTerm(result.results[0], namespace, result.ts)
        };
    }

    async getParents({ ref }: GetParentsParams): Promise<GetParentsResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const namespace = ontologyReferenceToNamespace(ref);

        const result = await client.get_parents({
            ns: namespace,
            id: ref.term,
            ts: ref.timestamp || Date.now()
        });

        return {
            terms: result.results.map((item) => {
                return relatedTermToTerm(item, namespace, result.ts);
            })
        };
    }

    async getChildren({ ref }: GetChildrenParams): Promise<GetChildrenResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const namespace = ontologyReferenceToNamespace(ref);

        const result = await client.get_children({
            ns: namespace,
            id: ref.term,
            ts: ref.timestamp || Date.now()
        });

        return {
            terms: result.results.map((item) => {
                return relatedTermToTerm(item, namespace, result.ts);
            })
        };
    }

    async getRelatedObjects({ ref, offset, limit }: GetRelatedObjectsParams): Promise<GetRelatedObjectsResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const result = await client.get_associated_ws_objects({
            ns: ontologyReferenceToNamespace(ref),
            id: ref.term,
            ts: ref.timestamp || Date.now(),
            offset, limit
        });

        // const features: Array<RelatedFeature> = result.results.reduce((features, genomeWithFeatures) => {
        //     genomeWithFeatures.features.forEach((feature) => {
        //         features.push({
        //             featureID: feature.feature_id,
        //             relatedAt: feature.updated_at,
        //             objectName: genomeWithFeatures.ws_obj.name,
        //             objectRef: {
        //                 workspaceID: genomeWithFeatures.ws_obj.workspace_id,
        //                 objectID: genomeWithFeatures.ws_obj.object_id,
        //                 version: genomeWithFeatures.ws_obj.version
        //             }
        //         });
        //     })
        //     return features;
        // }, []: Array<RelatedFeature>);

        // Get object info.
        const objectRefs = result.results.map((object) => {
            return {
                ref: `${object.ws_obj.workspace_id}/${object.ws_obj.object_id}/${object.ws_obj.version}`
            };
        });

        const wsClient = new GenericClient({
            module: 'Workspace',
            url: this.workspaceURL,
            token: this.token
        });

        const [objectsInfo] = await wsClient.callFunc<[GetObjectInfo3Params], [GetObjectInfo3Result]>('get_object_info3', [{
            objects: objectRefs,
            includeMetadata: 1,
            ignoreErrors: 0
        }]);

        // const features: Array<RelatedFeature> = [];
        // console.log('here 2', result);
        const objects = result.results.map((object, index) => {
            // console.log('here', object);
            // genomeWithFeatureCount.features.forEach((feature) => {
            //     features.push({
            //         featureID: feature.feature_id,
            //         relatedAt: feature.updated_at,
            //         objectName: genomeWithFeatures.ws_obj.name,
            //         objectRef: {
            //             workspaceID: genomeWithFeatures.ws_obj.workspace_id,
            //             objectID: genomeWithFeatures.ws_obj.object_id,
            //             version: genomeWithFeatures.ws_obj.version
            //         }
            //     });
            // });

            const objectInfo = objectsInfo.infos[index];

            // console.log('hmm', objectInfo);

            return {
                id: object.ws_obj.object_id,
                name: object.ws_obj.name,
                version: object.ws_obj.version,
                workspaceId: object.ws_obj.workspace_id,
                featureCount: object.feature_count,
                workspaceType: objectInfo[2]
            };
        });

        return {
            // features,
            objects,
            totalCount: objects.length
        };
    }

    async getAncestorGraph({ ref }: GetAncestorGraphParams): Promise<GetAncestorGraphResult> {
        const client = new OntologyAPIClient({
            token: this.token,
            url: this.url,
            timeout: REQUEST_TIMEOUT,
            version: this.ontologyAPIConfig.version
        });

        const result = await client.get_hierarchical_ancestors({
            ns: ontologyReferenceToNamespace(ref),
            id: ref.term,
            ts: ref.timestamp || Date.now(),
            // TODO: should these be params? We can't support paging for the ancestor graph,
            // and it should never be too large, so probably remove from the upstream api??
            offset: 0,
            limit: 1000
        });

        const relations: Array<TermsGraphRelation> = [];
        result.results.forEach((item) => {
            const relation = stringToTermRelation(item.edge.type);
            if (relations.some((r) => {
                return r.from === item.edge.from &&
                    r.to === item.edge.to &&
                    r.relation === relation;
            })) {
                return;
            }
            relations.push({
                relation,
                from: item.edge.from,
                to: item.edge.to
            });
        });
        const relationsMap = relations.reduce((m, r) => {
            let nodes = m.get(r.from);
            if (!nodes) {
                nodes = [];
            }
            nodes.push(r);
            m.set(r.from, nodes);
            return m;
        }, new Map<string, Array<TermsGraphRelation>>());

        const terms = new Map<string, TermsGraphNode>();
        result.results.forEach((item) => {
            if (!terms.has(item.term.id)) {
                const term = termNodeToTerm(item.term, ontologyReferenceToNamespace(ref), result.ts);
                let isRoot = false;
                const nodes = relationsMap.get(term.ref.term);
                if (!nodes) {
                    isRoot = true;
                }

                terms.set(item.term.id, {
                    id: term.ref.term,
                    term, isRoot
                });
            }
        });

        return {
            termsGraph: {
                terms: Array.from(terms.values()),
                relations
            }
        };
    }

    async getDataSourceInfo(namespace: Namespace): Promise<DataSourceInfo> {
        const client = new RelationEngineAPIClient({
            token: this.token,
            url: this.relationEngineURL,
            timeout: REQUEST_TIMEOUT
        });

        const { data_source: dataSource } = await client.data_source(namespace);

        return {
            source: stringToRelationEngineDataSource(dataSource.name),
            data_url: dataSource.data_url,
            home_url: dataSource.home_url,
            logo_url: dataSource.logo_url,
            title: dataSource.title
        };

    }
}