import React from 'react';
import { OntologyReference, OntologyTermBrief, OntologyRelation, OntologySource, OntologyTermRelatedBrief } from '../../types/ontology';
import './OntologyList.css';
import Term from './OntologyTerm';
import { Empty } from 'antd';

export interface Props {
    terms: Array<OntologyTermBrief>;
    maxItems: number;
    totalItems: number;
    selectedTermRef: OntologyReference | null;
    selectTermRef: (termRef: OntologyReference) => void;
    navigateToTermRef: (termREf: OntologyReference) => void;
}

interface State { }

export default class OntologyList extends React.Component<Props, State> {
    selectTerm(termRef: OntologyReference) {
        this.props.selectTermRef(termRef);
    }
    navigateToTerm(termRef: OntologyReference) {
        this.props.navigateToTermRef(termRef);
    }
    renderItemsPlain() {
        return this.props.terms.map((term) => {
            const isActive = this.props.selectedTermRef === term.ref;
            // const tempTerm: OntologyTermRelatedBrief = {
            //     ref: term.ref,
            //     name: 'hello',
            //     relation: OntologyRelation.IS_A,
            //     goID: 'hi'
            // }
            return (
                <Term
                    term={term}
                    isActive={isActive}
                    selectTerm={this.selectTerm.bind(this)}
                    key={term.ref.term}
                    navigateToTermRef={this.navigateToTerm.bind(this)}
                />
            );
        });
    }
    renderNoItems() {
        return <Empty description="No Children" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }
    render() {
        if (this.props.terms.length === 0) {
            return this.renderNoItems();
        }
        return this.renderItemsPlain();
    }
}
