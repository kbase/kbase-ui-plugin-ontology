/*
    The top level view.
    Each top level view is a generic interface with some fixed properties.
*/

import { AsyncView } from "../view";
import { UIError } from "../../../types/error";
import { TermView } from "./term";
import { SearchView } from "./search";

export type View = AsyncView<TermView | SearchView, UIError>;

