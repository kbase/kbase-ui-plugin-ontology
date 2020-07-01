import axios from 'axios';

export type DataSource =
    'ncbi_taxonomy' |
    'gtdb' |
    'go_ontology' |
    'envo_ontology' |
    'rdp_taxonomy';


export type DataSourceCategory = 'taxonomy' | 'ontology';

// A collection is a top level division of the re data model
// export type Collection = 'taxonomy' | 'ontology';

export interface GetNodeInfoResultBase {
    collection: DataSourceCategory;
    // source: string;
    created: number;
    expired: number;
    timestamp: number;
}

export interface GetNodeInfoResultTaxon extends GetNodeInfoResultBase {
    collection: 'taxonomy';
    // source: TaxonSource;
    namespace: string;
    id: string;
}

export interface GetNodeInfoResultOntology extends GetNodeInfoResultBase {
    collection: 'ontology';
    // source: OntologySource;
    namespace: string;
    id: string;
}

export type GetNodeInfoResult = GetNodeInfoResultTaxon | GetNodeInfoResultOntology;

// export interface GetNodeInfoResult<T, S> {
//     type: NodeType;
//     created: number;
//     source: TaxonSource | OntologySource;
//     version: string;
// }


export interface DataSourcesResult {
    data_sources: Array<DataSource>;
}

export interface DataSourceInfoResult {
    data_source: {
        category: DataSourceCategory;
        name: DataSource;
        data_url: string;
        home_url: string;
        logo_url: string;
        title: string;
    };
}

export interface RestClientParams {
    url: string;
    timeout: number;
    token: string;
}

export class RestClient {
    params: RestClientParams;
    constructor(params: RestClientParams) {
        this.params = params;
    }

    async get<ResultType>(path: Array<string>): Promise<ResultType> {
        const url = this.params.url + '/' + path.join('/');
        const result = await axios.get(url, {
            headers: {
                Accept: 'application/json'
            }
        });
        // TODO: handle errors!


        return (result.data as unknown) as ResultType;
    }
}

export default class RelationEngineAPIClient extends RestClient {
    async data_sources(): Promise<DataSourcesResult> {
        const path = [
            'api',
            'v1',
            'data_sources'
        ];
        return this.get<DataSourcesResult>(path);
    }

    async data_source(dataSource: DataSource): Promise<DataSourceInfoResult> {
        const path = [
            'api',
            'v1',
            'data_sources',
            dataSource
        ];
        return this.get<DataSourceInfoResult>(path);
    }
}
