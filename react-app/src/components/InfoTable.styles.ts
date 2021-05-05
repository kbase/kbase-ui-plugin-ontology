import React from 'react';

export interface Styles {
    [key: string]: React.CSSProperties
}

const styles: Styles  = {
    main: {

    },
    bordered: {
        border: '1px solid rgba(200, 200, 200, 0.2)'
    },
    row: {

    },
    labelCol: {
        color: 'rgba(175, 175, 175, 1)',
        padding: '4px',
        verticalAlign: 'top'
    },
    valueCol: {
        padding: '4px'
    }
};
export default styles;
