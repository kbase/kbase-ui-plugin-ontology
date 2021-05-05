import React from 'react';
import {RouteComponentProps} from "react-router-dom";


export type NotFoundProps = RouteComponentProps;

const NotFound: React.FC<NotFoundProps> = (props: NotFoundProps) => {
    return <div>
        <p>NOT FOUND!</p>
        <p>{props.location.pathname}</p>
    </div>;
}

export default NotFound;
