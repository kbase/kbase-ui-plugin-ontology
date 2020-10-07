import { Metadata } from "./metadata";

export type OntologyNamespace = string;


export type OntologyTerm = string;


export type OntologyReference = {
    namespace: string;
    term: OntologyTerm;
    timestamp?: number;
};



export type OntologyRelation = string;

export interface OntologyTermBrief {
    ref: OntologyReference;
    name: string;
    id: string;
}

export type OntologyRelatedTermBrief = {
    relation: OntologyRelation,
    term: OntologyTermBrief;
};

export interface OntologyTermRelatedBrief extends OntologyTermBrief {
    relation: OntologyRelation;
}

// Term - the full term info for detail

export interface OntologyTermRecord {
    ref: OntologyReference;
    name: string;
    comments: Array<string>;
    definition: string;
    isObsolete: boolean;

    metadata: Metadata;
}


export interface OntologyRelatedTerm {
    relation: OntologyRelation,
    term: OntologyTermRecord;
}

export interface OntologyRelatedTerms {
    term: OntologyTermRecord,
    terms: Array<OntologyRelatedTerm>;
}

/* Linked Objects */

export interface WorkspaceType {
    module: string;
    name: string;
}
export type WorkspaceID = number;
export type ObjectID = number;
export type ObjectVersion = number;
export interface WorkspaceObjectReference {
    workspaceID: WorkspaceID;
    id: ObjectID;
    version: ObjectVersion;
}

export interface LinkedObject {
    object: WorkspaceObjectReference;
    type: WorkspaceType,
    scientificName: string;
    feature: string;
}