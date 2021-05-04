import React from 'react';

import {Table, Alert, Select, Tooltip, Button, Empty} from 'antd';
import {RelatedGenome, ObjectInfo} from '../lib/model';
import styles from './style.module.css';
import {OntologyReference} from '../../../../types/ontology';
import ObjectDetail from './ObjectDetail';
import {SortKey, SortDirection} from './LinkedObjectsDB';
import {SelectValue} from 'antd/lib/select';
import Section from 'ui/Section';
import {NoData} from "@kbase/ui-components";

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
            scroll={{y: '100%'}}
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
                title="Name"
                // width="40%"
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
                            {row.scientificName}
                        </a>
                    );
                }}
                defaultSortOrder="ascend"
                sorter={(a: RelatedGenome, b: RelatedGenome) => {
                    return a.name.localeCompare(b.name);
                }}
            />
            {/*<Table.Column*/}
            {/*    dataIndex={"workspaceType"}*/}
            {/*    title="Type"*/}
            {/*    // width="40%"*/}
            {/*    render={(workspaceType: string, row: RelatedGenome) => {*/}
            {/*        const hash = [*/}
            {/*            'spec',*/}
            {/*            'type',*/}
            {/*            workspaceType*/}
            {/*        ].join('/');*/}
            {/*        const [, typeName,] = workspaceType.split(/[-.]/);*/}
            {/*        const url = new URL('', window.location.origin);*/}
            {/*        url.hash = hash;*/}
            {/*        // const search = url.searchParams;*/}
            {/*        // search.set('sub', 'Feature');*/}
            {/*        // search.set('subid', featureID);*/}
            {/*        return (*/}
            {/*            <a href={url.toString()} target="_blank" rel="noopener noreferrer">*/}
            {/*                {typeName}*/}
            {/*            </a>*/}
            {/*        );*/}
            {/*    }}*/}
            {/*    sorter={(a: RelatedGenome, b: RelatedGenome) => {*/}
            {/*        return a.workspaceType.localeCompare(b.workspaceType);*/}
            {/*    }}*/}
            {/*/>*/}
            <Table.Column
                dataIndex={"domain"}
                width="8em"
                title="Domain"
                render={(domain: string) => {
                   return <span>{domain}</span>
                }}
                 sorter={(a: RelatedGenome, b: RelatedGenome) => {
                    return a.domain.localeCompare(b.domain);
                }}
            />
            {/*<Table.Column*/}
            {/*    dataIndex={"scientificName"}*/}
            {/*    title="Name"*/}
            {/*    render={(scientificName: string) => {*/}
            {/*       return <span>{scientificName}</span>*/}
            {/*    }}*/}

            {/*/>*/}
            <Table.Column
                dataIndex={"source"}
                // width="8em"
                title="Source"
                render={(id: string) => {
                    return <span>{id}</span>
                }}
                sorter={(a: RelatedGenome, b: RelatedGenome) => {
                    return a.source.localeCompare(b.source);
                }}
            />
            <Table.Column
                dataIndex={"sourceId"}
                // width="8em"
                title="ID"
                render={(id: string) => {
                    return <span>{id}</span>
                }}
                sorter={(a: RelatedGenome, b: RelatedGenome) => {
                    return a.sourceId.localeCompare(b.sourceId);
                }}
            />
            <Table.ColumnGroup
                title='Feature Counts'
            >
                <Table.Column
                    dataIndex={"linkedFeatureCount"}
                    width="8em"
                    title="Linked"
                    render={(featureCount: number) => {
                        const content = (() => {
                            if (typeof featureCount !== 'number' || isNaN(featureCount)) {
                                return <NoData/>;
                            } else {
                                return Intl.NumberFormat('en-US', {
                                    useGrouping: true
                                }).format(featureCount);
                            }
                        })();

                        return <div style={{
                            fontFamily: 'monospace',
                            textAlign: 'right',
                            paddingRight: '2em'
                        }}>
                            {content}
                        </div>;
                    }}
                    sorter={(a: RelatedGenome, b: RelatedGenome) => {
                        if (isNaN(a.linkedFeatureCount)) {
                            return -1;
                        } else if (isNaN(b.linkedFeatureCount)) {
                            return 1;
                        }
                        return a.linkedFeatureCount - b.linkedFeatureCount;
                    }}
                />
                <Table.Column
                    dataIndex={"totalFeatureCount"}
                    width="8em"
                    title="Total"
                    render={(featureCount: number) => {
                        const content = (() => {
                            if (typeof featureCount !== 'number' || isNaN(featureCount)) {
                                return <NoData/>;
                            } else {
                                return Intl.NumberFormat('en-US', {
                                    useGrouping: true
                                }).format(featureCount);
                            }
                        })();
                        return <div style={{
                            fontFamily: 'monospace',
                            textAlign: 'right',
                            paddingRight: '2em'
                        }}>
                            {content}
                        </div>;
                    }}
                    sorter={(a: RelatedGenome, b: RelatedGenome) => {
                        if (isNaN(a.totalFeatureCount) || typeof a.totalFeatureCount !== 'number') {
                            return -1;
                        } else if (isNaN(b.totalFeatureCount)  || typeof b.totalFeatureCount !== 'number') {
                            return 1;
                        }
                        return a.totalFeatureCount - b.totalFeatureCount;
                    }}
                />
            </Table.ColumnGroup>
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
        return <Empty
            description="No genome features have yet been associated with this term"
            image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
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
                // onClick={() => { this.selectObject(object); }}
            >
                <div className={styles.CardNameRow}>
                    <div className={styles.ObjectName}>
                        <a href={`/#dataview/${ref}`} target="_blank" rel="noopener noreferrer">{object.name}</a>
                    </div>
                    <div className={styles.ObjectType}>
                        <Tooltip title={object.workspaceType}>
                            <a href={`/#spec/type/${object.workspaceType}`} target="_blank"
                               rel="noopener noreferrer">{typeName}</a>
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
            </div>;
        });
    }


    render() {
        if (this.props.linkedObjects.length === 0) {
            return this.renderNone();
        }
        return this.renderTable();
    }
}