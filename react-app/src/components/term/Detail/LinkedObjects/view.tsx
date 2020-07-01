import React from 'react';
import './style.css';
import { Table, Alert } from 'antd';
import { RelatedFeature } from '../../lib/model';

export interface Props {
    linkedObjects: Array<RelatedFeature>;
}

interface State {
}

export default class LinkedObjects extends React.Component<Props, State> {
    renderTable() {
        return <Table<RelatedFeature>
            dataSource={this.props.linkedObjects}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            size="small"
            pagination={false}
            scroll={{ y: '100%' }}
            rowKey={(row: RelatedFeature) => {
                return [
                    row.objectRef.workspaceID,
                    row.objectRef.objectID,
                    row.objectRef.version,
                    row.featureID
                ].join(':');
            }}
            bordered={false}
        >
            <Table.Column
                dataIndex={"objectName"}
                title="Object Name"
                width="40%"
                render={(objectName: string, row: RelatedFeature) => {
                    const hash = [
                        'dataview',
                        String(row.objectRef.workspaceID),
                        String(row.objectRef.objectID),
                        String(row.objectRef.version)
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    return (
                        <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                            {objectName}
                        </a>
                    );
                }}
            />
            <Table.Column
                dataIndex={"featureID"}
                title="Feature"
                width="40%"
                render={(featureID: string, row: RelatedFeature) => {
                    const hash = [
                        'dataview',
                        String(row.objectRef.workspaceID),
                        String(row.objectRef.objectID),
                        String(row.objectRef.version)
                    ].join('/');
                    // Note the sample url just to make URL happy.
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    const search = url.searchParams;
                    search.set('sub', 'Feature');
                    search.set('subid', featureID);
                    return (
                        <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                            {featureID}
                        </a>
                    );
                }}
            />
            <Table.Column
                dataIndex={"relatedAt"}
                width="20%"
                title="Linked"
                render={(relatedAt: number) => {
                    return Intl.DateTimeFormat('en-US').format(relatedAt);
                }}
            />
        </Table>;
    }
    renderNone() {
        return (
            <Alert type="info"
                message="No Linked Data"
                description={
                    <p>
                        No data objects have yet been associated with this term
                    </p>
                }
                showIcon
                style={{
                    margin: '0 auto',
                    marginTop: '20px'
                }}
            />
        );
    }
    render() {
        if (this.props.linkedObjects.length === 0) {
            return this.renderNone();
        }
        return this.renderTable();
    }
}