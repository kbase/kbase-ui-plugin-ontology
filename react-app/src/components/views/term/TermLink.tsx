import React from 'react';
import {
    OntologyTermRecord
} from '../../../types/ontology';
import { Tooltip } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { Source } from '../../../lib/OntologyAPIClient';

export interface Props {
    item: OntologyTermRecord;
    newWindow: boolean;
    source: Source;
}

interface State {
}

export default class TermLink extends React.Component<Props, State> {
    renderTemplate(template: string, context: Map<string, string>) {
        const url = template.replace(/{{(.*?)}}/g, (substring: string, key: string) => {
            return context.get(key) || `** ${key} not found **`;
        });

        const windowMessage = (() => {
            if (this.props.newWindow) {
                return <p>Opens in a separate window or tab.</p>;
            }
        })();

        const tooltip = (
            <React.Fragment>
                <p>Link to the {this.props.source.term_url_label} page for this term.</p>
                {windowMessage}
            </React.Fragment>
        );
        const target = this.props.newWindow ? '_blank' : '_parent';
        return (
            <Tooltip title={tooltip}>
                <a href={url} target={target}>
                    {url} <LinkOutlined />
                </a>
            </Tooltip>
        );
    }

    render() {
        const item = this.props.item;
        const template = this.props.source.term_url;
        const context = new Map();
        context.set('term', item.ref.term);

        return <span>{this.renderTemplate(template, context)}</span>;
    }
}