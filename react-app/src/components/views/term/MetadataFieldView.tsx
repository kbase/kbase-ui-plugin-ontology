import { Table } from 'antd';
import React from 'react';
import {
    MetadataArrayOfString, MetadataArrayOfSynonym, MetadataBoolean,
    MetadataField, MetadataNumber, MetadataSequence, MetadataString, Synonym
} from '../../../types/metadata';
import { na } from './lib/content';

export interface MetadataFieldViewProps {
    field: MetadataField;
}

interface MetadataFieldViewState {

}

export class MetadataFieldView extends React.Component<MetadataFieldViewProps, MetadataFieldViewState> {

    renderMetadatumString(metadatum: MetadataString) {
        return <div>
            {metadatum.value}
        </div>;
    }

    renderSequenceColored(sequence: string) {
        // see DRuMS Color Schemes: https://www.umass.edu/molvis/drums/nochime/1152/fs.html
        const colors: {
            [char: string]: string;
        } = {
            A: '#5050ff',
            T: '#e6e600',
            G: '#00c000',
            C: '#e00000',
            U: '#cc9900'
        };
        const coloredSequence = sequence.split('').map((char) => {
            return <span style={{ color: colors[char] }}>
                {char}
            </span>;
        });
        return <div className="InfoTable-dataCol" style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
            {coloredSequence}
        </div>;
    }

    renderMetadatumSequence(metadatum: MetadataSequence) {
        if (metadatum.value === null) {
            return na();
        }
        return <div>
            {this.renderSequenceColored(metadatum.value)}
        </div>;
    }

    renderMetadatumNumber(metadatum: MetadataNumber) {
        if (metadatum.value === null) {
            return na();
        }
        return <div>
            {metadatum.value}
        </div>;
    }

    renderMetadatumBoolean(metadatum: MetadataBoolean) {
        if (metadatum.value === null) {
            return na();
        }
        return <div>
            {metadatum.value ? 'Yes' : 'No'}
        </div>;
    }

    renderMetadatumArrayOfString(metadatum: MetadataArrayOfString) {
        if (metadatum.value === null) {
            return na();
        }
        return metadatum.value.map((item) => {
            return <div>
                {item}
            </div>;
        });
    }

    renderMetadatumArrayOfSynonym(metadatum: MetadataArrayOfSynonym) {
        if (metadatum.value === null) {
            return na();
        }
        const synonymNameSorter = (a: Synonym, b: Synonym) => {
            return stringSorter(a.pred, b.pred);
        };

        const synonymValueSorter = (a: Synonym, b: Synonym) => {
            return stringSorter(a.val, b.val);
        };

        const stringSorter = (a: string, b: string) => {
            const fixedA = a.replace(/^["']/, '');
            const fixedB = b.replace(/^["']/, '');
            return fixedA.localeCompare(fixedB);
        };
        const table = metadatum.value.map(({ pred, val }: { pred: string, val: string; }, index: number) => {
            return {
                pred, val, index
            };
        });
        return (
            <Table
                dataSource={table}
                className="KBaseAntdOverride-remove-table-border"
                size="small"
                // pagination={{ position: 'top' }}
                pagination={false}
                scroll={{ y: '25em' }}
                rowKey="index"
                bordered={false}
            >
                <Table.Column
                    title="Name"
                    dataIndex="pred"
                    key="pred"
                    defaultSortOrder="ascend"
                    sorter={synonymNameSorter}
                />
                <Table.Column
                    title="Value"
                    dataIndex="val"
                    key="val"
                    width="20em"
                    sorter={synonymValueSorter}
                />
            </Table>
        );
    }

    render() {
        const field = this.props.field;
        switch (field.type) {
            case 'string':
                return this.renderMetadatumString(field);
            case 'number':
                return this.renderMetadatumNumber(field);
            case 'boolean':
                return this.renderMetadatumBoolean(field);
            case 'array<string>':
                return this.renderMetadatumArrayOfString(field);
            case 'array<synonym>':
                return this.renderMetadatumArrayOfSynonym(field);
            case 'sequence':
                return this.renderMetadatumSequence(field);
        }
    }
}