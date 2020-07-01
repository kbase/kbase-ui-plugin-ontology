import { AsyncView } from "./view";
import { OntologyReference, OntologyTerm } from '../../types/ontology';
import { UIError } from "../../types/error";
import { LinkedObjects } from "./workspace";

export interface MainState {
    selectedTermRef: OntologyReference;
    selectedTerm: OntologyTerm;
    targetTerm: OntologyTerm;
}

export type MainView = AsyncView<MainState, UIError>

export interface OntologyStoreState {
    main: MainState;
}

// export type OntologyView = SyncView<ViewType.TAXONOMY, OntologyStoreState>;


export interface ParentsView {
    terms: Array<OntologyTerm>;
}

export interface ChildrenView {
    terms: Array<OntologyTerm>;
}

export interface OntologyView {
    target: {
        term: AsyncView<OntologyTerm, UIError>,
        parents: AsyncView<ParentsView, UIError>,
        children: AsyncView<ChildrenView, UIError>
    },
    selected: {
        term: AsyncView<OntologyTerm, UIError>,
        linkedData: AsyncView<LinkedObjects, UIError>
    }
}