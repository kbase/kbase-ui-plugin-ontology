import OntologyAPIClient, {
    TermNode, RelatedTerm, EdgeType, Namespace, Source
} from '../../../../lib/OntologyAPIClient';
import {
    OntologyReference, OntologyNamespace, OntologyTerm,
    OntologyRelatedTerm, OntologyRelation,
    OntologyTermRecord
} from '../../../../types/ontology';
import { DynamicServiceConfig } from '@kbase/ui-components/lib/redux/integration/store';
import { GenericClient } from '@kbase/ui-lib';
import { Metadata, transformField } from '../../../../types/metadata';
import { JSONObject } from '../../../../types/json';

const REQUEST_TIMEOUT = 30000;

// Supporting data types

// TODO: this should be more expansive, but ...

export type RelationEngineDataSource = string;

// Method Params and Results

export interface GetTermParams {
    ref: OntologyReference;
}

export interface GetTermResult {
    term: OntologyTermRecord;
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

// Related Objects

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
    ref: string;
    info: ObjectInfo;
    scientificName: string;
    domain: string;
}

export interface GetRelatedObjectsResult {
    objects: Array<RelatedObject>;
    totalCount: number;
}

// Related Features

export interface GetRelatedObjectFeaturesParams {
    ref: OntologyReference;
    objectRef: string;
    offset: number;
    limit: number;
    featureCount: number;
}

export interface Feature {
    id: string;
}

export interface GetRelatedObjectFeaturesResult {
    object: RelatedObject;
    totalCount: number;
    features: Array<Feature>;
}


//

export type NodeID = string;

export interface TermsGraphNode {
    term: OntologyTermRecord;
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

export function stringToTermRelation(relationString: EdgeType): OntologyRelation {
    return relationString;

}

export function relationToString(relation: OntologyRelation): string {
    return relation;
}

export interface OntologyModelParams {
    token: string;
    url: string;
    workspaceURL: string;
    ontologyAPIConfig: DynamicServiceConfig;
}

export interface GetObjectInfo3Params {
    objects: Array<any>;
    includeMetadata: number;
    ignoreErrors: number;
}

export interface ObjectMetadata {
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
    string, // workspace name
    string, // checksum
    number, // size in bytes
    ObjectMetadata, // metadata
];

export interface GetObjectInfo3Result {
    infos: Array<ObjectInfo>;
    paths: Array<Array<string>>;
}

export type ObjectRefString = string;

export interface ObjectIdentity {
    workspace?: string;
    wsid?: number;
    name?: string;
    objid?: number;
    ver?: number;
    ref?: ObjectRef;
}

export type ObjectRefChain = Array<ObjectIdentity>;

export type ObjectPath = string;

export interface ObjectSpecification {
    workspace?: string;
    wsid?: number;
    name?: string;
    objid?: number;
    ver?: number;
    ref?: ObjectRef;
    obj_path?: Array<ObjectRef>;
    obj_ref_path?: Array<ObjectRef>;
    find_reference_path?: number;
    included?: Array<ObjectPath>;
    strict_maps?: number;
    string_arrays?: number;
}

export interface GetObjects2Params {
    objects: Array<ObjectSpecification>;
    ignoreErrors?: number;
    no_data?: number;
}

export type ObjectRef = string;

export type ExtractedId = string;

// TODO: flesh this out

export type ProvenanceAction = JSONObject;

export interface ObjectData {
    data: JSONObject;
    info: ObjectInfo;
    path: Array<ObjectRef>;
    provenance: Array<ProvenanceAction>;
    creator: string;
    orig_wsid: number;
    created: string;
    epoch: number;
    refs: Array<ObjectRef>;
    copied: ObjectRef;
    copy_source_inaccessible: number;
    extracted_ids: { [id_type: string]: Array<ExtractedId>; };
    handle_error: string;
    handle_stacktrace: string;
}


export interface GetObjects2Result {
    data: Array<ObjectData>;
}

export default class OntologyModel {
    ontologyAPI: OntologyAPIClient;
    token: string;
    url: string;
    workspaceURL: string;
    ontologyAPIConfig: DynamicServiceConfig;
    constructor({ token, url, ontologyAPIConfig, workspaceURL }: OntologyModelParams) {
        this.token = token;
        this.url = url;
        this.workspaceURL = workspaceURL;
        this.ontologyAPIConfig = ontologyAPIConfig;
        this.ontologyAPI = new OntologyAPIClient({
            token,
            url,
            timeout: REQUEST_TIMEOUT,
            version: ontologyAPIConfig.version
        });
    }

    stringToOntologyNamespace(namespace: string): OntologyNamespace {
        // TODO: validate with source
        return namespace as OntologyNamespace;
    }

    async termNodeToTerm(term: TermNode, ns: string, ts: number): Promise<OntologyTermRecord> {
        const namespace = this.stringToOntologyNamespace(ns);
        const source = await this.ontologyAPI.get_source({ ns });

        if (source === null) {
            throw new Error(`Runtime Error: Source ${ns} not defined in Ontology Service.`);
        }

        const metadata: Metadata = this.fieldsToMetadata(term, source);
        return {
            ref: {
                namespace, // TODO: stringToOntologyNamespace(term.ns),
                term: term.id,
                timestamp: ts
            },
            name: term.name,
            comments: term.comments,
            definition: term.def ? term.def.val : 'n/a',
            isObsolete: false, // ignored for now?
            metadata
        };
    }

    async relatedTermToTerm(relatedTerm: RelatedTerm, namespace: Namespace, ts: number): Promise<OntologyRelatedTerm> {
        const term = await this.termNodeToTerm(relatedTerm.term, namespace, ts);
        const relation = stringToTermRelation(relatedTerm.edge.type);
        return {
            term, relation
        };
    }

    fieldsToMetadata(term: TermNode, source: Source): Metadata {
        const data: any = term as any;
        return source.fields
            .map((field) => {
                if (field.id in data) {
                    return transformField({
                        id: field.id,
                        type: field.type,
                        value: data[field.id],
                        def: field
                    });
                } else {
                    return transformField({
                        id: field.id,
                        type: field.type,
                        value: null,
                        def: field
                    });
                }
            });
    }

    async getTerm({ ref }: { ref: OntologyReference; }): Promise<GetTermResult> {
        const namespace = this.stringToOntologyNamespace(ref.namespace);
        const result = await this.ontologyAPI.get_terms({
            ns: namespace,
            ids: [ref.term],
            ts: ref.timestamp || Date.now()
        });

        return {
            term: await this.termNodeToTerm(result.results[0], namespace, result.ts)
        };
    }

    async getParents({ ref }: GetParentsParams): Promise<GetParentsResult> {
        const namespace = this.stringToOntologyNamespace(ref.namespace);
        const result = await this.ontologyAPI.get_parents({
            ns: namespace,
            id: ref.term,
            ts: ref.timestamp || Date.now()
        });

        const terms = await Promise.all(result.results.map((item) => {
            return this.relatedTermToTerm(item, namespace, result.ts);
        }));

        return {
            terms
        };
    }

    async getChildren({ ref }: GetChildrenParams): Promise<GetChildrenResult> {
        const namespace = this.stringToOntologyNamespace(ref.namespace);
        const result = await this.ontologyAPI.get_children({
            ns: namespace,
            id: ref.term,
            ts: ref.timestamp || Date.now()
        });

        const terms = await Promise.all(result.results.map((item) => {
            return this.relatedTermToTerm(item, namespace, result.ts);
        }));

        return {
            terms
        };
    }

    async getRelatedObjects({ ref, offset, limit }: GetRelatedObjectsParams): Promise<GetRelatedObjectsResult> {
        const result = await this.ontologyAPI.get_associated_ws_objects({
            ns: this.stringToOntologyNamespace(ref.namespace),
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

        const objectsInfo = await (async () => {
            if (objectRefs.length === 0) {
                return [];
            }
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.workspaceURL,
                token: this.token
            });

            console.log('object refs?', objectRefs);

            const [objectsInfo] = await wsClient.callFunc<[GetObjects2Params], [GetObjects2Result]>('get_objects2', [{
                objects: objectRefs.map(({ ref }) => {
                    return {
                        ref,
                        included: [
                            'scientific_name',
                            'domain'
                        ]
                    };
                }),
                ignoreErrors: 0,
                no_data: 1
            }]);
            console.log('objects ... info ...', objectsInfo);
            return objectsInfo.data;
        })();

        const objects = result.results.map((object, index) => {
            const objectData = objectsInfo[index];
            const [
                id, /* name */, type, /* savedDate */, version,
                /* savedBy */, workspaceId, /* workspaceName */, /* checksum */,
                /* size */, metadata
            ] = objectData.info;
            const ref = `${workspaceId}/${id}/${version}`;
            console.log('metadata', metadata);

            return {
                id: object.ws_obj.object_id,
                name: object.ws_obj.name,
                version: object.ws_obj.version,
                workspaceId: object.ws_obj.workspace_id,
                featureCount: object.feature_count,
                ref,
                workspaceType: type,
                info: objectData.info,
                scientificName: objectData.data['scientific_name'] as string,
                domain: objectData.data['domain'] as string
            };
        });

        return {
            // features,
            objects,
            totalCount: objects.length
        };
    }

    async getRelatedObjectFeatures({ ref, objectRef, offset, limit, featureCount }: GetRelatedObjectFeaturesParams): Promise<GetRelatedObjectFeaturesResult> {
        // if (typeof featureCount === 'undefined') {
        //     const result = await client.get_associated_ws_features({
        //         ns: ontologyReferenceToNamespace(ref),
        //         obj_ref: objectRef,
        //         id: ref.term,
        //         ts: ref.timestamp || Date.now(),
        //         offset, limit
        //     });

        //     features = result.results[0].features.map((feature) => {
        //         return {
        //             id: feature.feature_id
        //         };
        //     });

        //     featureCount = result.total_count;
        // }

        const ranges: Array<[number, number]> = [];

        for (let i = 0; i < featureCount / limit; i += 1) {
            ranges.push([i * limit, (i + 1) * limit]);
        }

        const fetchProcesses: Array<Promise<Array<Feature>>> = [];
        const fetcher = async (offset: number, limit: number): Promise<Array<Feature>> => {
            const result = await this.ontologyAPI.get_associated_ws_features({
                ns: this.stringToOntologyNamespace(ref.namespace),
                obj_ref: objectRef,
                id: ref.term,
                ts: ref.timestamp || Date.now(),
                offset, limit
            });
            return result.results[0].features.map((feature) => {
                return {
                    id: feature.feature_id
                };
            });
        };
        for (const [from, to] of ranges) {
            // limit = Math.min(needToGet, limit);
            fetchProcesses.push(fetcher(from, to - from));
        }

        const results = await Promise.all(fetchProcesses);

        let features: Array<Feature> = [];
        features = features.concat.apply([], results);

        // Get object info.
        const objectRefs = [{
            ref: objectRef
        }];

        const objectInfo = await (async () => {
            const wsClient = new GenericClient({
                module: 'Workspace',
                url: this.workspaceURL,
                token: this.token
            });

            const [objectsInfo] = await wsClient.callFunc<[GetObjects2Params], [GetObjects2Result]>('get_objects2', [{
                objects: objectRefs.map(({ ref }) => {
                    return {
                        ref,
                        included: [
                            'scientific_name',
                            'domain'
                        ]
                    };
                }),
                ignoreErrors: 0,
                no_data: 1
            }]);
            console.log('objects info?', objectsInfo);
            return objectsInfo.data[0];
        })();

        const [
            id, name, workspaceType, /* savedDate */, version,
            /* savedBy */, workspaceId, /*workspaceName*/, /* checksum */,
            /* size */, /* metadata */
        ] = objectInfo.info;
        // const objectRef = `${workspaceId}/${id}/${version}`;

        // const ws_obj = result.results[0].ws_obj;
        const object: RelatedObject = {
            id,
            name,
            version,
            workspaceId,
            ref: objectRef,
            featureCount,
            workspaceType,
            info: objectInfo.info,
            scientificName: objectInfo.data['scientific_name'] as string,
            domain: objectInfo.data['domain'] as string
        };

        return {
            // features,
            object,
            totalCount: featureCount,
            features
        };
    }

    async getAncestorGraph({ ref }: GetAncestorGraphParams): Promise<GetAncestorGraphResult> {
        const result = await this.ontologyAPI.get_hierarchical_ancestors({
            ns: this.stringToOntologyNamespace(ref.namespace),
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



        const termsToGet = result.results.reduce((termsToGet, item) => {
            termsToGet.set(item.term.id, item.term);
            return termsToGet;
        }, new Map());

        const terms = new Map<string, TermsGraphNode>();
        await Promise.all(Array.from(termsToGet.entries()).map(async ([id, termNode]) => {
            const term = await this.termNodeToTerm(termNode, this.stringToOntologyNamespace(ref.namespace), result.ts);
            let isRoot = false;
            const nodes = relationsMap.get(term.ref.term);
            if (!nodes) {
                isRoot = true;
            }
            terms.set(term.ref.term, {
                id: term.ref.term,
                term, isRoot
            });
        }));

        result.results.forEach(async (item) => {
            if (!terms.has(item.term.id)) {
                const term = await this.termNodeToTerm(item.term, this.stringToOntologyNamespace(ref.namespace), result.ts);
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

    async getSource(ns: string): Promise<Source | null> {
        return this.ontologyAPI.get_source({ ns });
    }

}