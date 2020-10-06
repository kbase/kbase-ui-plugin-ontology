import React from 'react';
import { OntologyReference, OntologyTermRecord } from '../../../../types/ontology';
import './style.css';
import Detail from '../Detail';
import { Row, Col } from 'antd';
import SourceInfo from './SourceInfo';
import TermSummary from './TermSummary';
import { Source } from '../../../../lib/OntologyAPIClient';

export interface Props {
    targetItem: OntologyTermRecord;
    selectedItem: OntologyTermRecord;
    source: Source;
    selectItem: (termRef: OntologyReference) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class OntologyView extends React.Component<Props, State> {
    componentDidMount() {
        this.props.setTitle(`Ontology Landing Page for "${this.props.targetItem.name}" (${this.props.targetItem.ref.term})`);
    }

    renderLayout() {
        return (
            <div className="Col scrollable Ontology">
                <div className="Col-auto Ontology-summary-section">
                    <Row>
                        <Col span={12}>
                            <TermSummary item={this.props.targetItem} />
                        </Col>
                        <Col span={12}>
                            <SourceInfo source={this.props.source} />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">
                    <div className="Col scrollable" >
                        <Detail item={this.props.selectedItem} source={this.props.source} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderLayout();
    }
}
