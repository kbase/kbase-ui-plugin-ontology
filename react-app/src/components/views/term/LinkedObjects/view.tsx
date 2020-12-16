import React from 'react';
import { Table, Alert, Tooltip, Input, Select } from 'antd';
import { RelatedObject } from '../lib/model';
import { LinkedObject } from '../../../../types/ontology';
import './style.css';

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
                width="12em"
                render={(workspaceType: string, row: RelatedObject) => {
                    const hash = [
                        'spec',
                        'type',
                        workspaceType
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    const [module, name, majorVersion, minorVersion] = workspaceType.split(/[.-]/);
                    return (
                        <Tooltip title={workspaceType}>
                            <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                                {name}
                            </a>
                        </Tooltip>
                    );
                }}
                sorter={(a: RelatedObject, b: RelatedObject) => {
                    return a.workspaceType.localeCompare(b.workspaceType);
                }}
            />
            <Table.Column
                dataIndex={"savedBy"}
                title="Last saved by"
                width="8em"
                render={(savedBy: string, row: RelatedObject) => {
                    // TODO: flatten the objects for better table usage?
                    savedBy = row.info.savedBy;
                    const hash = [
                        'user',
                        savedBy
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    return (
                        <Tooltip title={savedBy}>
                            <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                                {savedBy}
                            </a>
                        </Tooltip>
                    );
                }}
                sorter={(a: RelatedObject, b: RelatedObject) => {
                    return a.workspaceType.localeCompare(b.workspaceType);
                }}
            />
            <Table.Column
                dataIndex={"updated"}
                width="8em"
                title="Last updated"
                render={(featureCount: number, linkedObject: RelatedObject) => {
                    return <span>{Intl.DateTimeFormat('en-US', {}).format(new Date(linkedObject.info.savedAt))}</span>;
                }}
                sorter={(a: RelatedObject, b: RelatedObject) => {
                    return a.info.savedAt - b.info.savedAt;
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

    renderFilterControl() {
        return <span>
            <span className="LinkedObjects-filterLabel">filter by - </span>{' '}
            <span className="LinkedObjects-filterFieldLabel">type:</span>
            <Select style={{ width: '6em' }}>
                <Select.Option value="tes1t">Test 1</Select.Option>
                <Select.Option value="test2">Test 2</Select.Option>
            </Select>
            {' '}
            <span className="LinkedObjects-filterFieldLabel">user:</span>
            <Select style={{ width: '6em' }}>
                <Select.Option value="tes1t">Test 1</Select.Option>
                <Select.Option value="test2">Test 2</Select.Option>
            </Select>
        </span>;
    }

    renderControls() {
        return <div>
            <Input.Search placeholder="Search" allowClear style={{ width: '12em', margin: '0 1em' }} />

            {this.renderFilterControl()}
        </div>;
    }

    renderLinkedObjects() {
        return <>
            <div style={{ flex: '0 0 auto' }}>{this.renderControls()}</div>
            <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'column', minHeight: '0' }}>
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