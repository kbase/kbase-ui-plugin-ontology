import React from 'react';

import { Table, Alert, Select, Tooltip, Button } from 'antd';
import { RelatedGenome, ObjectInfo } from '../lib/model';
import styles from './style.module.css';
import Features from './Features';
import { OntologyReference } from '../../../../types/ontology';
import ObjectDetail from './ObjectDetail';
import { SortKey, SortDirection } from './LinkedObjectsDB';
import { SelectValue } from 'antd/lib/select';
import Section from 'ui/Section';

export interface Props {
    linkedObjects: Array<RelatedGenome>;
    totalCount: number;
    selectObject: (object: RelatedGenome) => void;
    selectedObject: RelatedGenome | null;
    termRef: OntologyReference;
    sortObjects: (sortBy: SortKey, direction: SortDirection) => void;
}

interface State {
    selectedObjectInfo: ObjectInfo | null;
}

export default class LinkedObjects extends React.Component<Props, State> {
    currentSortDirection: SortDirection;
    currentSortKey: SortKey;

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedObjectInfo: null
        };
        this.currentSortDirection = 'ascending';
        this.currentSortKey = 'name';
    }

    renderTable() {
        return <Table<RelatedGenome>
            dataSource={this.props.linkedObjects}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            size="small"
            pagination={false}
            // pagination={{
            //     pageSize: 20
            // }}
            scroll={{ y: '100%' }}
            rowKey={(row: RelatedGenome) => {
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
                render={(name: string, row: RelatedGenome) => {
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
                sorter={(a: RelatedGenome, b: RelatedGenome) => {
                    return a.name.localeCompare(b.name);
                }}
            />
            <Table.Column
                dataIndex={"workspaceType"}
                title="Type"
                width="40%"
                render={(workspaceType: string, row: RelatedGenome) => {
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
                sorter={(a: RelatedGenome, b: RelatedGenome) => {
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
                sorter={(a: RelatedGenome, b: RelatedGenome) => {
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

    selectObject(object: RelatedGenome) {
        // const ref = `${object.workspaceId}/${object.id}/${object.version}`;
        this.props.selectObject(object);
        this.setState({
            selectedObjectInfo: object.info
        });
    }

    renderObjects() {
        return this.props.linkedObjects.map((object) => {
            const ref = `${object.workspaceId}/${object.id}/${object.version}`;
            const classNames: Array<string> = [styles.Object];

            if (this.props.selectedObject?.ref === ref) {
                classNames.push(styles.SelectedObject);
            }
            const [, typeName,] = object.workspaceType.split(/[-.]/);
            return <div
                className={classNames.join(' ')}
                key={ref}
                onClick={() => { this.selectObject(object); }}
            >
                <div className={styles.CardNameRow}>
                    <div className={styles.ObjectName}>
                        <a href={`/#dataview/${ref}`} target="_blank" rel="noopener noreferrer">{object.name}</a>
                    </div>
                    <div className={styles.ObjectType}>
                        <Tooltip title={object.workspaceType}>
                            <a href={`/#spec/type/${object.workspaceType}`} target="_blank" rel="noopener noreferrer">{typeName}</a>
                        </Tooltip>
                    </div>
                </div>
                <div className={styles.CardNameRow}>
                    <div className={styles.ScientificName}>
                        <Tooltip title={`Domain: ${object.domain}`}>
                            {object.scientificName}
                        </Tooltip>
                    </div>
                    <div className={styles.Domain}>
                        {object.domain}
                    </div>
                </div>
                <div className={styles.CardNameRow}>
                    <div className={styles.Source}>
                        <span className={styles.Label}>Source</span>
                        <span>{object.source}</span>
                    </div>
                    <div className={styles.SourceID}>
                        <span className={styles.Label}>ID</span>
                        <span>{object.sourceId}</span>
                    </div>
                </div>
                <div className={styles.CardNameRow}>
                    <div className={styles.KBaseID}>
                        <span className={styles.Label}>KBase ID</span>
                        <span>{object.kbaseId}</span>
                    </div>
                </div>
                <div className={styles.CardFeaturesRow}>
                    <span className={styles.Label}>Features</span>
                    <span>

                        {Intl.NumberFormat('en-US', {
                            useGrouping: true
                        }).format(object.linkedFeatureCount)} <span className={styles.Suffix}>linked, out of</span>
                        {' '}
                        {Intl.NumberFormat('en-US', {
                            useGrouping: true
                        }).format(object.totalFeatureCount)} <span className={styles.Suffix}>total</span>
                    </span>

                </div>
            </div >;
        });
    }

    handleSortChange(value: SelectValue) {
        this.currentSortKey = value.toString() as SortKey;
        this.props.sortObjects(this.currentSortKey, this.currentSortDirection);
    }

    renderSortSelect() {
        return <Select
            defaultValue='name'
            dropdownMatchSelectWidth={true}
            style={{ width: '10em' }}
            onChange={this.handleSortChange.bind(this)}
        >
            <Select.Option value="name">Name</Select.Option>
            <Select.Option value="featureCount">Feature Count</Select.Option>
        </Select>;
    }

    handleSortDirectionChange(value: SelectValue) {
        this.currentSortDirection = value as SortDirection;
        this.props.sortObjects(this.currentSortKey, this.currentSortDirection);
    }

    renderSortDirectionControl() {
        return <Select
            defaultValue="ascending"
            dropdownMatchSelectWidth={true}
            style={{ width: '9em' }}
            onChange={this.handleSortDirectionChange.bind(this)}>
            <Select.Option value="ascending">Ascending</Select.Option>
            <Select.Option value="descending">Descending</Select.Option>
        </Select>;
    }

    renderControls() {
        return <div style={{ marginBottom: '6px', textAlign: 'center' }}>
            <span>Sort: </span>
            {this.renderSortSelect()}
            {' '}
            {this.renderSortDirectionControl()}
        </div>;
    }

    renderSummary() {
        return <div style={{ marginBottom: '6px', textAlign: 'center', fontStyle: 'italic' }}>
            {this.props.linkedObjects.length} {this.props.linkedObjects.length === 1 ? 'genome' : 'genomes'} found
        </div>;
    }

    renderLinkedObjects() {
        return <>
            <div style={{ flex: '0 0 auto' }}>{this.renderControls()}</div>
            <div style={{ flex: '0 0 auto' }}>{this.renderSummary()}</div>
            <div style={{ flex: '1 1 0px', overflowY: 'auto' }}>
                {this.renderObjects()}
            </div>
        </>;
    }

    renderFeatures() {
        if (this.props.selectedObject === null) {
            return <Alert
                type="info"
                message={<p>Select an object to show its linked features...</p>}
                style={{ width: '40em', margin: '10px auto' }}
            />;
        }
        return <Features
            termRef={this.props.termRef}
            object={this.props.selectedObject}
            key={this.props.selectedObject.ref} />;
    }

    renderColumnHeading(title: string) {
        return <div className={styles.ColumnHeading}>
            <div></div>
            <div>{title}</div>
            <div></div>
        </div>;
    }

    renderToolbar() {
        const ref = this.props.selectedObject?.ref;
        return <div>
            <Button type="text" size="small" onClick={() => {
                window.open(`/#dataview/${ref}`, "_blank");
            }}>
                view
            </Button>
        </div>;
    }

    renderLayout() {
        return <div className="Col">
            <div className="Row">
                <div className="Col" style={{ marginRight: '5px' }}>
                    <Section title="Genomes" fullheight={true}>
                        <div className="Col">
                            {this.renderLinkedObjects()}
                        </div>
                    </Section>
                </div>
                <div className="Col Col-grow-2" style={{ marginLeft: '5px' }}>
                    <Section title="Genome" fullheight={false} renderToolbar={this.renderToolbar.bind(this)}>
                        <ObjectDetail objectInfo={this.state.selectedObjectInfo} />
                    </Section>
                    <Section title="Features" fullheight={true}>
                        {this.renderFeatures()}
                    </Section>
                </div>
            </div>
        </div>;
    }

    render() {
        if (this.props.linkedObjects.length === 0) {
            return this.renderNone();
        }
        return this.renderLayout();
    }
}