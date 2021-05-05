import Term from 'components/views/term';
import React from 'react';
import {RouteComponentProps} from "react-router-dom";
import {OntologyReference} from "../types/ontology";

export interface ViewParams {
    namespace: string;
    id: string;
    ts?: string;
}


export type ViewProps = RouteComponentProps<ViewParams>


const TermView: React.FC<ViewProps> = (props: ViewProps) => {
    const {namespace, id, ts} = props.match.params;
    const ref: OntologyReference = {
        namespace,
        term: id,
        timestamp: (ts ? parseInt(ts) : undefined)
    };
    return <Term termRef={ref} />;
}

export default TermView;
