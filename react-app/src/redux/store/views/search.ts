import { AsyncView } from "../view";
import { OntologyTerm } from '../../../types/ontology';
import { UIError } from "../../../types/error";

export interface MainState {
    searchTerm: string;
}

export type MainView = AsyncView<MainState, UIError>;

export interface SearchStoreState {
    main: MainState;
}

export interface SearchView {
    searchTerm: string;
    terms: Array<OntologyTerm>;
}