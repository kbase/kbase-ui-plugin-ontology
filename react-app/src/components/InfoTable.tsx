import React from 'react';
import styles from './InfoTable.styles';

export type ValueColString = string;
export type ValueColRenderer = () => React.ReactNode;
export type ValueCol = ValueColString | ValueColRenderer;

export interface InfoTableRow {
    label: string;
    value: ValueCol;
}


export interface InfoTableProps {
    table: Array<InfoTableRow>;
    bordered?: boolean;
}

interface InfoTableState {

}

export default class InfoTable extends React.Component<InfoTableProps, InfoTableState> {
    constructor(props: InfoTableProps) {
        super(props);
    }

    renderValue(value: ValueCol) {
        if (typeof value === 'string') {
            return value;
        }
        return value();
    }

    renderRows() {
        return this.props.table.map(({label, value}) => {
            return <tr style={styles.row} key={label}>
                <th style={styles.labelCol}>
                    {label}
                </th>
                <td style={styles.valueCol}>
                    {this.renderValue(value)}
                </td>
            </tr>;
        });
    }

    render() {
        let tableStyle = {...styles.main};
        if (this.props.bordered) {
            tableStyle = {...tableStyle, ...styles.bordered}
            // Object.assign(tableStyle, styles.bordered);
        }
        return <table style={tableStyle}>
            {this.renderRows()}
        </table>;
    }
}
