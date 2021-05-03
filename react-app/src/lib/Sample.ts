import {JSONObject, JSONObjectOf} from "@kbase/ui-lib/lib/json";

export type SDKBoolean = 0 | 1;

export type SampleNodeId = string;

export type SampleId = string;

export type SampleVersion = number;

export type Username = string;

export type EpochTimeMS = number;

export type SampleNodeType = "BioReplicate" | "TechReplicate" | "SubSample";

export type WSUPA = string;
export type WorkspaceUniquePermanentAddress = WSUPA;

// export interface UserMetadata {
//     [k: string]: MetadataValue;
// }

export interface MetadataValueWithoutUnits extends JSONObject {
    value: string | number | boolean;
}

export interface MetadataValueWithUnits extends JSONObject {
    value: string | number | boolean;
    units: string;
}

export type MetadataValue = MetadataValueWithoutUnits | MetadataValueWithUnits;


export type Metadata = JSONObjectOf<MetadataValue>;


// TODO: interfaces for specific controlled metadata.
// may not be practical, but consider it.
// export interface ControlledMetadata {
//     [k: string]: MetadataValue;
// }

export type MetadataSource = Array<MetadataSourceField>;

export interface MetadataSourceField extends JSONObject {
    key: string;
    skey: string;
    svalue: {
        value: string;
    };
}

export interface SampleNode extends JSONObject {
    id: SampleNodeId;
    parent: SampleNodeId | null;
    type: SampleNodeType;
    meta_controlled: Metadata;
    meta_user: Metadata;
    source_meta: MetadataSource;
}

export interface Sample  extends JSONObject {
    id: SampleId;
    user: Username;
    node_tree: Array<SampleNode>;
    name: string;
    save_date: EpochTimeMS;
    version: SampleVersion;
    // TODO: these fields don't yet exist upstream.
    // format_id: string;
    // format_version: number;
    // sample_set_ref: string;
}