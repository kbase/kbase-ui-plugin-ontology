import React from 'react';
import './style.css';
import { Table, Alert } from 'antd';
import { RelatedObject } from '../lib/model';

export interface Props {
    linkedObjects: Array<RelatedObject>;
    totalCount: number;
}

interface State {
}

export default class LinkedObjects extends React.Component<Props, State> {
    renderTable() {
        return <Table<RelatedObject>
            dataSource={this.props.linkedObjects}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            size="small"
            pagination={false}
            // pagination={{
            //     pageSize: 20
            // }}
            scroll={{ y: '100%' }}
            rowKey={(row: RelatedObject) => {
                return [
                    row.workspaceId,
                    row.id,
                    row.version
                ].join(':');
            }}
            bordered={false}
        >
            <Table.Column
                dataIndex={"name"}
                title="Object Name"
                width="40%"
                render={(name: string, row: RelatedObject) => {
                    const hash = [
                        'dataview',
                        String(row.workspaceId),
                        String(row.id),
                        String(row.version)
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    return (
                        <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                            {name}
                        </a>
                    );
                }}
                defaultSortOrder="ascend"
                sorter={(a: RelatedObject, b: RelatedObject) => {
                    return a.name.localeCompare(b.name);
                }}
            />
            <Table.Column
                dataIndex={"workspaceType"}
                title="Type"
                width="40%"
                render={(workspaceType: string, row: RelatedObject) => {
                    const hash = [
                        'spec',
                        'type',
                        workspaceType
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    // const search = url.searchParams;
                    // search.set('sub', 'Feature');
                    // search.set('subid', featureID);
                    return (
                        <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                            {workspaceType}
                        </a>
                    );
                }}
                sorter={(a: RelatedObject, b: RelatedObject) => {
                    return a.workspaceType.localeCompare(b.workspaceType);
                }}
            />
            <Table.Column
                dataIndex={"featureCount"}
                width="8em"
                title="# Features"
                render={(featureCount: number) => {
                    const content = Intl.NumberFormat('en-US', {
                        useGrouping: true
                    }).format(featureCount);
                    return <div style={{
                        fontFamily: 'monospace',
                        textAlign: 'right',
                        paddingRight: '2em'
                    }}>
                        {content}
                    </div>;
                }}
                sorter={(a: RelatedObject, b: RelatedObject) => {
                    return a.linkedFeatureCount - b.linkedFeatureCount;
                }}
            />

        </Table>;
    }
    /*
                // <Table.Column
            //     dataIndex={"relatedAt"}
            //     width="20%"
            //     title="Linked"
            //     render={(relatedAt: number) => {
            //         return Intl.DateTimeFormat('en-US').format(relatedAt);
            //     }}
            // />
    */
    renderControls() {
        return <div>
            Controls Here
        </div>;
    }

    renderLinkedObjects() {
        return <>
            <div style={{ flex: '0 0 auto' }}>{this.renderControls()}</div>
            <div style={{ flex: '1 1 0px' }}>
                {this.renderTable()}
            </div>
        </>;
    }
    renderNone() {
        return (
            <Alert type="info"
                message="No Linked Genomes"
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
        return this.renderLinkedObjects();

        // return <Empty
        //     image={Empty.PRESENTED_IMAGE_SIMPLE}
        //     description="Linked Genomes currently disabled - working on a replacement" >
        // </Empty>;
    }
}