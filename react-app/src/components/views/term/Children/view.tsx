import React from 'react';
import { OntologyRelatedTerm, OntologyRelation } from '../../../../types/ontology';
import './style.css';
import { Empty, Table, Tooltip } from 'antd';
import Column from 'antd/lib/table/Column';
import { relationToString } from '../lib/model';

export interface Props {
    terms: Array<OntologyRelatedTerm>;
}

interface State { }

export default class OntologyList extends React.Component<Props, State> {
    renderRelation(relation: OntologyRelation) {
        return relationToString(relation);
    }

    renderItemsTable() {
        return <Table<OntologyRelatedTerm>
            dataSource={this.props.terms}
            className="ScrollingFlexTable"
            size="small"
            pagination={false}
            rowKey={(row: OntologyRelatedTerm) => {
                return row.term.ref.term;
            }}
            scroll={{ y: '100%' }}
            locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Children" >
                </Empty>
            }}
        >
            <Column
                dataIndex={['term', 'name']}
                title="Name"
                width="60%"
                render={(name: string, term: OntologyRelatedTerm) => {
                    return <a href={`/#ontology/term/${term.term.ref.namespace}/${term.term.ref.term}/${term.term.ref.timestamp}`} target="_parent">
                        {name}
                    </a>;
                }}
                defaultSortOrder="ascend"
                sorter={(a: OntologyRelatedTerm, b: OntologyRelatedTerm) => {
                    return a.term.name.localeCompare(b.term.name);
                }}
            />
            <Column dataIndex="relation" title="Relation" width="20%"
                render={(relation: OntologyRelation) => {
                    return this.renderRelation(relation);
                }} />
            <Column dataIndex={['term', 'goID']} title="ID" width="20%"
                render={(id: string, term: OntologyRelatedTerm) => {
                    const tooltip = (
                        <div>
                            {term.term.name}<br />
                            {term.term.ref.term}
                            <hr />
                            {term.term.definition}
                        </div>
                    );
                    return (
                        <Tooltip title={tooltip} placement="left">
                            <a href={`/#ontology/term/${term.term.ref.namespace}/${term.term.ref.term}/${term.term.ref.timestamp}`} target="_parent">
                                {term.term.ref.term}
                            </a>
                        </Tooltip>
                    );
                }}
                sorter={(a: OntologyRelatedTerm, b: OntologyRelatedTerm) => {
                    return a.term.ref.term.localeCompare(b.term.ref.term);
                }}
            />

        </Table>;
    }
    // renderNoItems() {
    //     return <Empty description="No Children" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    // }
    render() {
        // if (this.props.terms.length === 0) {
        //     return this.renderNoItems();
        // }
        return this.renderItemsTable();
    }
}
