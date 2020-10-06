import React from 'react';
import { Feature } from '../../lib/model';
import { Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { na } from '../../lib/content';

export interface FeaturesProps {
    objectRef: string;
    features: Array<Feature>;
}

export interface FeaturesState {

}

export default class Features extends React.Component<FeaturesProps, FeaturesState> {
    renderFeatures() {
        return <Table
            dataSource={this.props.features}
            className="KBaseAntdOverride-remove-table-border ScrollingFlexTable"
            rowKey="id"
            pagination={false}
            scroll={{ y: '100%' }}
            size="small"
        >
            <Column
                title="Feature ID"
                dataIndex="id"
                render={(id: string, feature: Feature) => {
                    const hash = [
                        'dataview',
                        this.props.objectRef
                    ].join('/');
                    const url = new URL('', window.location.origin);
                    url.hash = hash;
                    const search = url.searchParams;
                    search.set('sub', 'Feature');
                    search.set('subid', feature.id);
                    return (
                        <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                            {id}
                        </a>
                    );
                }} />
            <Column
                title="Function"
                dataIndex="function"
                render={(fun: string, feature: Feature) => {
                    return na();
                }} />
            <Column
                title="Length"
                dataIndex="length"
                render={(length: number, feature: Feature) => {
                    return na();
                }} />
            <Column
                title="Location"
                dataIndex="location"
                render={(location: string, feature: Feature) => {
                    return na();
                }} />
        </Table>;
    }
    renderX() {
        return this.props.features.map((feature) => {
            const hash = [
                'dataview',
                this.props.objectRef
            ].join('/');
            const url = new URL('', window.location.origin);
            url.hash = hash;
            const search = url.searchParams;
            search.set('sub', 'Feature');
            search.set('subid', feature.id);
            return (
                <a href={url.toString()} target="_blank" rel="noopener noreferrer">
                    {feature.id}
                </a>
            );
            // return <div>
            //     {feature.id}
            // </div>;
        });
    }
    render() {
        return this.renderFeatures();
    }
}