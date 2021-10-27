import React from 'react';
import {
    TermsGraph, relationToString, TermsGraphNode,
} from '../lib/model';
import NetworkGraph, { NetworkData } from './NetworkGraph';
import { OntologyTermRecord } from '../../../../types/ontology';
import Children from '../Children';
import './style.css';
import { Table } from 'antd';
import Section from "../../../../ui/Section";

export interface AncestorGraphProps {
    item: OntologyTermRecord;
    graph: TermsGraph;
}

interface AncestorGraphState {
    selectedNodeID: string | null;
}

export default class AncestorGraph extends React.Component<AncestorGraphProps, AncestorGraphState> {
    constructor(props: AncestorGraphProps) {
        super(props);
        this.state = {
            selectedNodeID: null
        };
    }
    selectGraphNode(termNode: TermsGraphNode) {
        this.setState({
            selectedNodeID: termNode.term.ref.term
        });
    }
    renderTable() {
        return <Table
            dataSource={this.props.graph.terms}
            size="small"
            pagination={false}
            scroll={{ y: '100%' }}
            className="ScrollingFlexTable"
            rowSelection={{
                onSelect: (termNode: TermsGraphNode) => {
                    this.selectGraphNode(termNode);
                },

                type: 'radio',
                // fixed: false,
                // hideDefaultSelections: true,
                selectedRowKeys: this.state.selectedNodeID ? [this.state.selectedNodeID] : []
            }}
            rowKey={(node: TermsGraphNode) => {
                return node.id;
            }}>

            <Table.Column dataIndex="term"
                defaultSortOrder="ascend"
                sorter={(a: TermsGraphNode, b: TermsGraphNode) => {
                    return a.term.name.localeCompare(b.term.name);
                }}
                key="term.id"
                title="Name"
                width="85%"
                render={(term: OntologyTermRecord, termNode: TermsGraphNode) => {
                    return <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            this.selectGraphNode(termNode);
                        }}>
                        {term.name}
                    </span>;
                }}
            />

            <Table.Column dataIndex="term"
                sorter={(a: TermsGraphNode, b: TermsGraphNode) => {
                    return a.term.name.localeCompare(b.term.name);
                }}
                title="ID"
                width="15em"
                render={(item: OntologyTermRecord) => {
                    const url = [
                        '/#ontology',
                        'term',
                        item.ref.namespace,
                        item.ref.term
                    ].join('/');
                    return (
                        <a href={url} target="_parent">{item.ref.term}</a>
                    );
                }} />
        </Table>;
    }
    selectNodeID(nodeID: string) {
        this.setState({
            selectedNodeID: nodeID
        });
    }
    renderChildren() {
        return <Children termRef={this.props.item.ref} />
    }
    render() {
        const nodes = this.props.graph.terms.map((termNode) => {
            const isTerm = termNode.id === this.props.item.ref.term;
            return {
                id: termNode.id,
                label: termNode.term.name,
                isTerm: isTerm,
                isRoot: termNode.isRoot,
                isSelected: termNode.term.ref.term === this.state.selectedNodeID
            };
        });
        
        const edges = this.props.graph.relations.map((relation) => {
            return {
                from: relation.from,
                to: relation.to,
                label: relationToString(relation.relation)
            };
        });
        const data: NetworkData = {
            nodes,
            edges
        };
        return (
            <div className="AncestorGraph">
                <div className="AncestorGraph-layout">
                    <div className="AncestorGraph-graph">
                        <NetworkGraph
                            data={data}
                            height="400px"
                            selectedNodeID={this.state.selectedNodeID}
                            selectNodeID={this.selectNodeID.bind(this)} />
                    </div>
                    <div className="AncestorGraph-tables">
                        <Section title="Ancestors" fullheight={true}>
                            <div className="AncestorGraph-table">
                                {this.renderTable()}
                            </div>
                        </Section>
                        <Section title="Children" fullheight={true}>
                            <div className="AncestorGraph-table">
                                {this.renderChildren()}
                            </div>
                        </Section>
                    </div>
                </div>
            </div>
        );
    }

}