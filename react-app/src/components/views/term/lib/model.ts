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

import sample1Data from './data/sample1.json';
import sample2Data from './data/sample2.json';
import sample3Data from './data/sample3.json';
import sample4Data from './data/sample4.json';
import sample5Data from './data/sample5.json';
import sample6Data from './data/sample6.json';
import sample7Data from './data/sample7.json';

import { Sample } from '../../../../lib/Sample';

const sample1 = sample1Data as Sample;
const sample2 = sample2Data as Sample;
const sample3 = sample3Data as Sample;
const sample4 = sample4Data as Sample;
const sample5 = sample5Data as Sample;
const sample6 = sample6Data as Sample;
const sample7 = sample7Data as Sample;

const samples: Array<Sample> = [
    sample1, sample2, sample3, sample4, sample5, sample6, sample7
];

const samplesMap: Map<string, Array<Sample>> = new Map();
samples.forEach((sample) => {
    const term = sample.node_tree[0].meta_controlled.biome.value as string;
    if (!samplesMap.has(term)) {
        samplesMap.set(term, []);
    }
    samplesMap.get(term)!.push(sample);
});


// const samples = [
//     sample1, sample2
// ] as Array<Sample>;

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

export interface GetRelatedGenomesParams {
    ref: OntologyReference;
    offset: number;
    limit: number;
}

export interface WorkspaceObjectReference {
    workspaceID: number;
    objectID: number;
    version: number;
}

export interface RelatedObject {
    name: string;
    id: number;
    version: number;
    workspaceId: number;
    workspaceType: string;
    ref: string;
    info: ObjectInfo;
}

export interface GetRelatedObjectsResult {
    objects: Array<RelatedObject>;
    totalCount: number;
}

export interface GetRelatedGenomesResult {
    objects: Array<RelatedGenome>;
    totalCount: number;
}

// export interface RelatedFeature {
//     objectName: string;
//     featureID: string;
//     relatedAt: number;
//     objectRef: WorkspaceObjectReference;
// }

export interface RelatedGenome {
    name: string;
    id: number;
    version: number;
    workspaceId: number;
    linkedFeatureCount: number;
    workspaceType: string;
    ref: string;
    info: ObjectInfo;
    scientificName: string;
    domain: string;
    source: string;
    sourceId: string;
    kbaseId: string;
    totalFeatureCount: number;
}

export interface GetRelatedGenomesResult {
    objects: Array<RelatedGenome>;
    totalCount: number;
}

// Related Features

export interface GetRelatedGenomeFeaturesParams {
    ref: OntologyReference;
    objectRef: string;
    offset: number;
    limit: number;
    featureCount: number;
}

export interface Feature {
    id: string;
}

export interface GetRelatedGenomeFeaturesResult {
    object: RelatedGenome;
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

export type RawObjectInfo = [
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

export interface ObjectInfo {
    objectId: number,
    objectName: string,
    workspaceType: string,
    savedAt: number,
    objectVersion: number,
    savedBy: string,
    workspaceId: number,
    workspaceName: string,
    checksum: string,
    size: number;
    metadata: ObjectMetadata;
}

export interface GetObjectInfo3Result {
    infos: Array<RawObjectInfo>;
    paths: Array<Array<string>>;
}


export interface RelatedSample {
    fieldKey: string;
    sample: Sample;
}


export interface GetRelatedSamplesParams {
    ref: OntologyReference;
    offset: number;
    limit: number;
}

export interface GetRelatedSamplesResult {
    samples: Array<RelatedSample>;
    totalAccessibleCount: number;
    totalCount: number;
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

            const [objectsInfo] = await wsClient.callFunc<[GetObjectInfo3Params], [GetObjectInfo3Result]>('get_object_info3', [{
                objects: objectRefs,
                includeMetadata: 1,
                ignoreErrors: 0
            }]);
            return objectsInfo.infos;
        })();

        const objects = result.results.map((object, index) => {
            const objectInfo = objectsInfo[index];
            const [
                id, /* name */, /* type */, /* savedDate */, version,
                /* savedBy */, workspaceId, /* workspaceName */, /* checksum */,
                /* size */, metadata
            ] = objectInfo;
            const ref = `${workspaceId}/${id}/${version}`;
            // console.log('metadata', metadata);

            const info: ObjectInfo = (() => {
                const [
                    objectId, objectName, workspaceType, savedAtString, objectVersion,
                    savedBy, workspaceId, workspaceName, checksum,
                    size, metadata
                ] = objectInfo;
                const savedAt = new Date(savedAtString).getTime();
                return {
                    objectId, objectName, workspaceType, savedAt, objectVersion,
                    savedBy, workspaceId, workspaceName, checksum,
                    size, metadata
                };
            })();

            return {
                id: object.ws_obj.object_id,
                name: object.ws_obj.name,
                version: object.ws_obj.version,
                workspaceId: object.ws_obj.workspace_id,
                ref,
                workspaceType: objectInfo[2],
                info,
            } as RelatedObject;
        });

        return {
            // features,
            objects,
            totalCount: objects.length
        };
    }

    async getRelatedGenomes({ ref, offset, limit }: GetRelatedGenomesParams): Promise<GetRelatedGenomesResult> {
        const result = await this.ontologyAPI.get_associated_ws_genomes({
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

            const [objectsInfo] = await wsClient.callFunc<[GetObjectInfo3Params], [GetObjectInfo3Result]>('get_object_info3', [{
                objects: objectRefs,
                includeMetadata: 1,
                ignoreErrors: 0
            }]);
            return objectsInfo.infos;
        })();

        const objects = result.results.map((object, index) => {
            const objectInfo = objectsInfo[index];
            const [
                id, /* name */, /* type */, /* savedDate */, version,
                /* savedBy */, workspaceId, /* workspaceName */, /* checksum */,
                /* size */, metadata
            ] = objectInfo;
            const ref = `${workspaceId}/${id}/${version}`;
            // console.log('metadata', metadata);

            const info: ObjectInfo = (() => {
                const [
                    objectId, objectName, workspaceType, savedAtString, objectVersion,
                    savedBy, workspaceId, workspaceName, checksum,
                    size, metadata
                ] = objectInfo;
                const savedAt = new Date(savedAtString).getTime();
                return {
                    objectId, objectName, workspaceType, savedAt, objectVersion,
                    savedBy, workspaceId, workspaceName, checksum,
                    size, metadata
                };
            })();

            return {
                id: object.ws_obj.object_id,
                name: object.ws_obj.name,
                version: object.ws_obj.version,
                workspaceId: object.ws_obj.workspace_id,
                linkedFeatureCount: object.feature_count,
                ref,
                workspaceType: objectInfo[2],
                info,
                scientificName: metadata['Name'],
                domain: metadata['Domain'],
                source: metadata['Source'],
                sourceId: metadata['Source ID'],
                totalFeatureCount: parseInt(metadata['Number features']), // TODO: check if empty
                kbaseId: 'not in metadata?'
            };
        });

        return {
            // features,
            objects,
            totalCount: objects.length
        };
    }

    async getRelatedGenomeFeatures({ ref, objectRef, offset, limit, featureCount }: GetRelatedGenomeFeaturesParams): Promise<GetRelatedGenomeFeaturesResult> {
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

            const [objectsInfo] = await wsClient.callFunc<[GetObjectInfo3Params], [GetObjectInfo3Result]>('get_object_info3', [{
                objects: objectRefs,
                includeMetadata: 1,
                ignoreErrors: 0
            }]);
            return objectsInfo.infos[0];

        })();

        const [
            id, name, workspaceType, /* savedDate */, version,
            /* savedBy */, workspaceId, /* workspaceName */, /* checksum */,
            /* size */, metadata
        ] = objectInfo;
        // const objectRef = `${workspaceId}/${id}/${version}`;

        const info: ObjectInfo = (() => {
            const [
                objectId, objectName, workspaceType, savedAtString, objectVersion,
                savedBy, workspaceId, workspaceName, checksum,
                size, metadata
            ] = objectInfo;
            const savedAt = new Date(savedAtString).getTime();
            return {
                objectId, objectName, workspaceType, savedAt, objectVersion,
                savedBy, workspaceId, workspaceName, checksum,
                size, metadata
            };
        })();


        // const ws_obj = result.results[0].ws_obj;
        const object: RelatedGenome = {
            id,
            name,
            version,
            workspaceId,
            ref: objectRef,
            linkedFeatureCount: featureCount,
            workspaceType,
            info,
            scientificName: metadata['Name'],
            domain: metadata['Domain'],
            source: metadata['Source'],
            sourceId: metadata['Source ID'],
            kbaseId: 'not in metadata?',
            totalFeatureCount: parseInt(metadata['Number features']), // TODO: check if empty
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

    async getRelatedSamples({ ref, offset, limit }: GetRelatedSamplesParams): Promise<GetRelatedSamplesResult> {
        const result = await this.ontologyAPI.get_associated_samples({
            ns: this.stringToOntologyNamespace(ref.namespace),
            id: ref.term,
            ts: ref.timestamp || Date.now(),
            offset, limit
        });

        const samples = result.results.map(({ sample, sample_metadata_key }) => {
            return {
                fieldKey: sample_metadata_key,
                sample
            };
        });

        return {
            samples,
            totalAccessibleCount: result.total_accessible_count,
            totalCount: result.total_count,
        };
    }
}
