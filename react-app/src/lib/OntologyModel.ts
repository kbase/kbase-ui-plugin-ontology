import RelationEngineAPIClient from "./RelationEngineAPIClient";

export interface OntologyModelParams {
    token: string;
    url: string;
    timeout: number;
}

export default class OntologyModel {
    relationEngineClient: RelationEngineAPIClient;
    constructor({ token, url, timeout }: OntologyModelParams) {
        this.relationEngineClient = new RelationEngineAPIClient({ token, url, timeout });
    }
}