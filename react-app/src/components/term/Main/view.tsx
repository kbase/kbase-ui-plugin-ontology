import React from 'react';
import { OntologyReference, OntologySource, OntologyItem } from '../../../types/ontology';
import './style.css';
import Detail from '../Detail';
import { Row, Col } from 'antd';
import SourceInfo from './SourceInfo';
import TermSummary from './TermSummary';
import { Navigation } from '../../../redux/store';
import { DataSourceInfo } from '../lib/model';

export interface Props {
    // termRef: OntologyReference;
    targetItem: OntologyItem;
    selectedItem: OntologyItem;
    // dataSource: Namespace;
    dataSourceInfo: DataSourceInfo;
    selectItem: (termRef: OntologyReference) => void;
    navigate: (navigation: Navigation) => void;
    setTitle: (title: string) => void;
}

interface State { }

export default class OntologyView extends React.Component<Props, State> {
    renderOwnId() {
        switch (this.props.targetItem.type) {
            case OntologySource.GO:
                return this.props.targetItem.goID;
            case OntologySource.ENVO:
                return this.props.targetItem.envoID;
        }
    }
    componentDidMount() {
        this.props.setTitle(`Ontology Landing Page for "${this.props.targetItem.name}" (${this.renderOwnId()})`);
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
                            <SourceInfo dataSourceInfo={this.props.dataSourceInfo} />
                        </Col>
                    </Row>
                </div>
                <div className="Row scrollable">
                    <div className="Col scrollable" >
                        <Detail item={this.props.selectedItem} />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.renderLayout();
    }
}
