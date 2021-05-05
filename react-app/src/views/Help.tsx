import React from 'react';
import { RouteComponentProps } from "react-router-dom";

export type HelpProps = RouteComponentProps;

const Help: React.FC<HelpProps> = (props: HelpProps) => {
    return <div>
        <p>Help for the samples Plugin...</p>
    </div>;
}

export default Help;
