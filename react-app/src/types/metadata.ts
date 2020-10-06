import { SourceFieldDefinition } from "../lib/OntologyAPIClient";

export interface MetadataBase {
    id: string;
    label: string;
    tooltip: string;
    type: string;
}

export interface MetadataString extends MetadataBase {
    type: 'string',
    value: string | null;
}

export interface MetadataSequence extends MetadataBase {
    type: 'sequence',
    value: string | null;
}

export interface MetadataBoolean extends MetadataBase {
    type: 'boolean',
    value: boolean | null;
}

export interface MetadataNumber extends MetadataBase {
    type: 'number',
    value: number | null;
}

export interface MetadataArrayOfString extends MetadataBase {
    type: 'array<string>',
    value: Array<string> | null;
}

export interface Synonym {
    pred: string;
    val: string;
}

export interface MetadataArrayOfSynonym extends MetadataBase {
    type: 'array<synonym>',
    value: Array<Synonym> | null;
}


export type MetadataField =
    MetadataString |
    MetadataBoolean |
    MetadataNumber |
    MetadataArrayOfString |
    MetadataArrayOfSynonym |
    MetadataSequence;

export type Metadata = Array<MetadataField>;


// export type SourceFieldDataType = 'string' | 'number' | 'boolean' | 'array<string>' | 'array<synonym>' | 'sequence';

// export interface SourceFieldDefinition {
//     id: string;
//     type: SourceFieldDataType;
//     label: string;
//     tooltip: string;
//     description: string;
// }

// export interface Source {
//     id: string;
//     namespace: string;
//     data_url: string;
//     home_url: string;
//     logo_url: string;
//     title: string;
//     fields: Array<SourceFieldDefinition>;
// }



export function transformField({ id, type, value, def }: { id: string, type: string, value: any, def: SourceFieldDefinition; }): MetadataField {
    const { label, tooltip } = def;
    switch (type) {
        case 'string':
            if (value === null) {
                return {
                    id, type, value, label, tooltip
                };
            } else if (typeof value === 'string') {
                return {
                    id, type, value, label, tooltip
                };
            } else {
                throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
            }
        case 'boolean':
            if (value === null) {
                return {
                    id, type, value, label, tooltip
                };
            } else if (typeof value === 'boolean') {
                return {
                    id, type, value, label, tooltip
                };
            } else {
                throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
            }
        case 'number':
            if (value === null) {
                return {
                    id, type, value, label, tooltip
                };
            } else if (typeof value === 'number') {
                return {
                    id, type, value, label, tooltip
                };
            } else {
                throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
            }
        case 'array<string>':
            if (value === null) {
                return {
                    id, type, value, label, tooltip
                };
            } else if (Array.isArray(value) && value.every((value) => {
                return typeof value === 'string';
            })) {
                return {
                    id, type, value, label, tooltip
                };
            } else {
                throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
            }
        case 'array<synonym>':
            if (value === null) {
                return {
                    id, type, value, label, tooltip
                };
            } else if (Array.isArray(value) && value.every((value) => {
                return 'pred' in value &&
                    typeof value.pred === 'string' &&
                    'val' in value &&
                    typeof value.val === 'string';
            })) {
                return {
                    id, type, value, label, tooltip
                };
            } else {
                throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
            }
        case 'sequence':
            if (value === null) {
                return {
                    id, type, value, label, tooltip
                };
            } else if (typeof value === 'string') {
                return {
                    id, type, value, label, tooltip
                };
            } else {
                throw new Error(`Metadata field should be ${type} but is ${typeof value}`);
            }
        default:
            throw new Error('Unsupported type: ' + type);
    }
}