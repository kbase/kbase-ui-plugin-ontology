import React from 'react';
import { OntologyTermRecord } from '../../../../types/ontology';

export interface Props {
    item: OntologyTermRecord;
}

interface State {

}

export default class TermSummary extends React.Component<Props, State> {
    render() {
        return (
            <div className="InfoTable">
                <div className="InfoTable-row">
                    <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                        ID
                    </div>
                    <div className="InfoTable-dataCol">
                        {this.props.item.ref.term}
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