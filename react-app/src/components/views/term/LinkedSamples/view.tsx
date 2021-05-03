import React from 'react';
import { Table, Tooltip, Input, Select, Empty } from 'antd';
import { RelatedSample } from '../lib/model';
import './style.css';

export interface Props {
    linkedSamples: Array<RelatedSample>;
    totalAccessibleCount: number;
    totalCount: number;
}

interface State {
}

export default class LinkedSamples extends React.Component<Props, State> {
    renderTable() {
        return <Table<RelatedSample>
            dataSource={this.props.linkedSamples}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            size="small"
            pagination={false}
            // pagination={{
            //     pageSize: 20
            // }}
            scroll={{ y: '100%' }}
            rowKey={(row: RelatedSample) => {
                return [
                    row.sample.id,
                    row.sample.version,
                    row.fieldKey
                ].join(':');
            }}
            bordered={false}
        >
            <Table.Column
                dataIndex={"fieldKey"}
                key="fieldKey"
                width="12em"
                ellipsis={true}
                title="Sample Field"
                render={(fieldKey: string, row: RelatedSample) => {
                    return <span>{fieldKey}</span>;
                }}
                sorter={(a: RelatedSample, b: RelatedSample) => {
                    return a.fieldKey.localeCompare(b.fieldKey);
                }}
            />
            <Table.Column
                dataIndex={"sample.id"}
                title="Sample Id"
                width="15%"
                ellipsis={true}
                render={(_: string, row: RelatedSample) => {
                    const id = row.sample.node_tree[0]!.id;

                    const hash = [
                        'samples',
                        'view',
                        String(row.sample.id),
                        String(row.sample.version)
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    return (
                        <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                            {id}
                        </a>
                    );
                }}
                sorter={(a: RelatedSample, b: RelatedSample) => {
                    const aId = a.sample.node_tree[0]!.id;
                    const bId = b.sample.node_tree[0]!.id;
                    return aId.localeCompare(bId);
                }}
            />

            <Table.Column
                dataIndex={"sample.name"}
                title="Sample Name"
                // No width -- should expand to take up rest of horizontal space
                // width="70%"
                render={(name: string, row: RelatedSample) => {
                    return (
                        <Tooltip placement="bottomLeft" title={row.sample.name}>
                            <span>{row.sample.name}</span>
                        </Tooltip>
                    );
                }}
                ellipsis={{
                    showTitle: false
                }}
                sorter={(a: RelatedSample, b: RelatedSample) => {
                    return a.sample.name.localeCompare(b.sample.name);
                }}
            />
            <Table.Column
                dataIndex={"sample.savedAt"}
                width="8em"
                ellipsis={true}
                title="Saved"
                render={(savedAt: number, row: RelatedSample) => {
                    return <span>{Intl.DateTimeFormat('en-US', {}).format(new Date(row.sample.save_date))}</span>;
                }}
                defaultSortOrder="descend"
                sorter={(a: RelatedSample, b: RelatedSample) => {
                    return a.sample.save_date - b.sample.save_date;
                }}
            />
            <Table.Column
                dataIndex={"sample.savedBy"}
                title="Saved by"
                width="12em"
                ellipsis={true}
                render={(savedBy: number, row: RelatedSample) => {
                    // TODO: flatten the objects for better table usage?
                    const hash = [
                        'user',
                        row.sample.user
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    return (
                        <Tooltip title={row.sample.user}>
                            <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                                {row.sample.user}
                            </a>
                        </Tooltip>
                    );
                }}
                sorter={(a: RelatedSample, b: RelatedSample) => {
                    return a.sample.user.localeCompare(b.sample.user);
                }}
            />

            {/*<Table.Column*/}
            {/*    // dataIndex={"sample.savedAt"}*/}
            {/*    key="fieldCount"*/}
            {/*    width="7em"*/}
            {/*    ellipsis={true}*/}
            {/*    title="# Fields"*/}
            {/*    render={(_: number, row: RelatedSample) => {*/}
            {/*        const fieldCount = Object.keys(row.sample.node_tree[0]!.meta_controlled).length +*/}
            {/*            Object.keys(row.sample.node_tree[0]!.meta_user).length;*/}
            {/*        return <span>{Intl.NumberFormat('en-US', {*/}
            {/*            useGrouping: true*/}
            {/*        }).format(fieldCount)}</span>;*/}
            {/*    }}*/}
            {/*    sorter={(a: RelatedSample, b: RelatedSample) => {*/}
            {/*        return a.sample.save_date - b.sample.save_date;*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<Table.Column*/}
            {/*    // dataIndex={"sample.savedAt"}*/}
            {/*    key="fieldCount"*/}
            {/*    width="9em"*/}
            {/*    ellipsis={true}*/}
            {/*    title="# Narratives"*/}
            {/*    render={(_: number, row: RelatedSample) => {*/}
            {/*        return <Tooltip title="The meaning of life">42</Tooltip>;*/}
            {/*    }}*/}
            {/*    sorter={(a: RelatedSample, b: RelatedSample) => {*/}
            {/*        return 42 - 42;*/}
            {/*    }}*/}
            {/*/>*/}

            {/*<Table.Column*/}
            {/*    // dataIndex={"sample.savedAt"}*/}
            {/*    key="fieldCount"*/}
            {/*    width="8em"*/}
            {/*    ellipsis={true}*/}
            {/*    title="# Objects"*/}
            {/*    render={(_: number, row: RelatedSample) => {*/}
            {/*        return <Tooltip title="Life's meaning">420</Tooltip>;*/}
            {/*    }}*/}
            {/*    sorter={(a: RelatedSample, b: RelatedSample) => {*/}
            {/*        return 420 - 420;*/}
            {/*    }}*/}
            {/*/>*/}

            {/* <Table.Column
                // dataIndex={"sample.savedAt"}
                key="fieldCount"
                width="8em"
                title="User Fields"
                render={(_: number, row: RelatedSample) => {
                    return <span>{Intl.NumberFormat('en-US', {
                        useGrouping: true
                    }).format(Object.keys(row.sample.node_tree[0]!.meta_user).length)}</span>;
                }}
                sorter={(a: RelatedSample, b: RelatedSample) => {
                    return a.sample.save_date - b.sample.save_date;
                }}
            /> */}



        </Table>;
    }

    renderFilterControl() {
        return <span>
            <span className="LinkedObjects-filterLabel">filter by - </span>{' '}
            <span className="LinkedObjects-filterFieldLabel">field:</span>
            <Select style={{ width: '6em' }}>
                <Select.Option value="tes1t">Field 1</Select.Option>
                <Select.Option value="test2">Field 2</Select.Option>
            </Select>
            {' '}
            <span className="LinkedObjects-filterFieldLabel">user:</span>
            <Select style={{ width: '6em' }}>
                <Select.Option value="tes1t">Test 1</Select.Option>
                <Select.Option value="test2">Test 2</Select.Option>
            </Select>
        </span>;
    }

    renderTotals() {
        const totalHidden = this.props.totalCount - this.props.totalAccessibleCount;
        if (totalHidden === 0) {
            return <span>
                <span style={{fontWeight: 'bold'}}>{Intl.NumberFormat('en-US', {useGrouping: true}).format(this.props.totalAccessibleCount)}</span>
                {' '}
                sample{this.props.totalAccessibleCount !== 1 ? 's': ''} linked to this term
            </span>;
        }
        return <span>
            {this.props.totalAccessibleCount} samples shown <i>({totalHidden}) not accessible)</i>
        </span>
    }

    renderHeader() {
        return <div style={{marginBottom: '6px'}}>
            {/*<Input.Search placeholder="Search" allowClear style={{ width: '12em', margin: '0 1em' }} />*/}
            {/*{this.renderFilterControl()}*/}
            {/*{' '}*/}
            {this.renderTotals()}
        </div>;
    }

    renderLinkedSamples() {
        return <>
            <div style={{ flex: '0 0 auto' }}>
                {this.renderHeader()}
            </div>
            <div style={{ flex: '1 1 0px', display: 'flex', flexDirection: 'column', minHeight: '0' }}>
                {this.renderTable()}
            </div>
        </>;
    }
    renderNone() {
        return <Empty
            description="No samples have yet been associated with this term"
            image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    render() {
        if (this.props.linkedSamples.length === 0) {
            return this.renderNone();
        }
        return this.renderLinkedSamples();

        // return <Empty
        //     image={Empty.PRESENTED_IMAGE_SIMPLE}
        //     description="Linked Genomes currently disabled - working on a replacement" >
        // </Empty>;
    }
}
