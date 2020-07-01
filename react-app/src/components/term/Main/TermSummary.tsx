import React from 'react';
import { OntologySource, OntologyItem } from '../../../types/ontology';

export interface Props {
    item: OntologyItem;
}

interface State {

}

export default class TermSummary extends React.Component<Props, State> {
    renderOwnId() {
        switch (this.props.item.type) {
            case OntologySource.GO:
                return this.props.item.goID;
            case OntologySource.ENVO:
                return this.props.item.envoID;
        }
    }
    render() {
        return (
            <div className="InfoTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        ID
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.renderOwnId()}
                    </div>
                </div>
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        Name
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.item.name}
                    </div>
                </div>

            </div>
        );
    }

}