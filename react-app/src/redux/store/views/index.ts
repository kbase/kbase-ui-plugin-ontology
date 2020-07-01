/*
    The top level view.
    Each top level view is a generic interface with some fixed properties.
*/

import { AsyncView } from "../view";
import { UIError } from "../../../types/error";
import { TermView } from "./term";
import { SearchView } from "./search";

// export type MainView = ViewBase<TaxonomyView> | ViewBase<OntologyView> | null;

export type View = AsyncView<TermView | SearchView, UIError>;

// export interface TopLevelViewStateBase {
//     type: ViewType;
//     // ref: RelationEngineReference;
//     view: MainView;
// }

// export interface TopLevelViewStateOntology extends TopLevelViewStateBase {
//     type: ViewType.ONTOLOGY;
//     view: AsyncView<OntologyView, UIError>;
// }

// export type TopLevelViewState = TopLevelViewStateTaxonomy | TopLevelViewStateOntology;


// export type TopLevelView = AsyncView<TopLevelViewState, UIError>
