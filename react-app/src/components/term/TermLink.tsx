import React from 'react';
import {
    OntologySource, GOOntologyTerm, ENVOOntologyTerm, OntologyItem
} from '../../types/ontology';
import { Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

export interface Props {
    item: OntologyItem;
    newWindow: boolean;
}

interface State {
}

export default class TermLink extends React.Component<Props, State> {
    renderGOLink(item: GOOntologyTerm) {
        const href = `http://amigo.geneontology.org/amigo/term/${item.goID}`;
        const target = this.props.newWindow ? '_blank' : '_parent';
        const tooltip = (
            <React.Fragment>
                <p>Link to the Gene Ontology AmiGO page for this term.</p>
                <p>Opens in a separate window or tab.</p>
            </React.Fragment>
        );
        return (
            <Tooltip title={tooltip}>
                <a href={href} target={target}>
                    {item.ref.term} <LinkOutlined />
                </a>
            </Tooltip>
        );
    }

    renderENVOLink(item: ENVOOntologyTerm) {
        // e.g. http://purl.obolibrary.org/obo/ENVO_00001998 
        const termID = item.envoID.replace(':', '_');
        const href = `http://purl.obolibrary.org/obo/${termID}`;
        // const href = `http://amigo.geneontology.org/amigo/term/${term.goID}`;
        const target = this.props.newWindow ? '_blank' : '_parent';
        const tooltip = (
            <React.Fragment>
                <p>Link to the ENVO Ontology Ontobee page for this term.</p>
                <p>Opens in a separate window or tab.</p>
            </React.Fragment>
        );
        return (
            <Tooltip title={tooltip}>
                <a href={href} target={target}>
                    {item.ref.term} <LinkOutlined />
                </a>
            </Tooltip>
        );
    }

    render() {
        const item = this.props.item;
        switch (item.type) {
            case (OntologySource.GO):
                return this.renderGOLink(item);
            case (OntologySource.ENVO):
                return this.renderENVOLink(item);
        }
    }
}