import React from 'react';
import {UIError} from "../types/error";
import {Alert, Collapse} from 'antd';
import {CaretRightOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {isJSONArray, isJSONObject, JSONValue} from "lib/json";
import InfoTable from "../components/InfoTable";

export interface ErrorViewProps {
    title?: string;
    error: UIError;
}

interface ErrorViewState {

}

export default class ErrorView extends React.Component<ErrorViewProps, ErrorViewState> {

    renderJSON() {
        if (!('data' in this.props.error) || typeof this.props.error.data === 'undefined') {
            return;
        }

        const r = (d: JSONValue): React.ReactNode => {
            switch (typeof d) {
                case 'undefined':
                    // TODO: not possible if actually a JSONValue, but
                    // this handles optional properties...
                    return <span style={{fontStyle: 'italic'}}>undefined</span>;
                case 'string':
                    return <span>{d}</span>;
                case 'boolean':
                    return d ? <span>True</span> : <span>False</span>;
                case 'number':
                    return <span>{String(d)}</span>;
                case 'object':
                    if (d === null) {
                        return <span><code>null</code></span>
                    } else if (isJSONArray(d)) {
                        return <div>
                            {
                                d.map((item, index) => {
                                    return <div key={index}>
                                        {r(item)}
                                    </div>;
                                }).join('\n')
                            }
                        </div>
                    } else if (isJSONObject(d, true)) {
                        const table = Object.entries(d).map(([label, value]) => {
                                    return {
                                        label,
                                        value: () => r(value)
                                    }
                                });
                        return <InfoTable table={table} bordered={true}/>
                    } else {
                        console.log('hmm', d);
                        return <span>** Not a JSONValue ** {typeof d}</span>
                    }
            }
        }

        return r(this.props.error.data);
    }

    renderDetail() {
        if (!this.props.error.data) {
            return;
        }

        return <Collapse defaultActiveKey={['message', 'code', 'source']}
                         bordered={false}
                         collapsible="disabled"
                         expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                         ghost={true}>
            <Collapse.Panel key="detail"
                            header="Detail"
                            collapsible="header">
                {this.renderJSON()}
            </Collapse.Panel>
        </Collapse>
    }

    renderTitle() {
        return <span>
            <ExclamationCircleOutlined style={{color: 'red'}}/>
            {' '}
            {this.props.title || 'Error'}
        </span>;
    }

    renderBody() {

        const table = [
            {
                label: 'Code',
                value: this.props.error.code
            }, {
                label: 'Source',
                value: this.props.error.source
            }];

        return <div>
            <p style={{marginTop: '10px'}}>
                {this.props.error.message}
            </p>

            <InfoTable table={table}/>

            {this.renderDetail()}
        </div>;
    }

    render() {
        return (
            <Alert type="error" message={this.renderTitle()} description={this.renderBody()}></Alert>
        );
    }
}