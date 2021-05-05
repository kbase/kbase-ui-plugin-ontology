import React from 'react';
import {UIError} from "../types/error";
import {Alert, Collapse} from 'antd';
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {isJSONArray, isJSONObject, JSONValue} from "@kbase/ui-lib/lib/json";

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

        const r = (d: JSONValue) => {
            switch (typeof d) {
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
                                d.map((item) => {
                                    return <div>
                                        {r(item)}
                                    </div>;
                                }).join('\n')
                            }
                        </div>
                    } else if (isJSONObject(d)) {
                        return <div>
                            {
                                Object.entries(d).map(([key, value]) => {
                                    return <table>
                                        <tr>
                                            <th>
                                                {key}
                                            </th>
                                            <td>
                                                {r(value)}
                                            </td>
                                        </tr>
                                    </table>
                                })
                            }
                        </div>
                    } else {
                        return <span>** Not a JSONValue **</span>
                    }
            }
        }

        return r(this.props.error.data);
    }

    renderDetail() {
        if (!this.props.error.data) {
            return;
        }

        return <Collapse.Panel key="detail" header="Detail" collapsible="header">
            {this.renderJSON()}
        </Collapse.Panel>
    }

    renderTitle() {
        return <span>
            <ExclamationCircleOutlined style={{color: 'red'}}/>
            {' '}
            {this.props.title || 'Error'}
        </span>;
    }

    renderBody() {
        return <Collapse defaultActiveKey={['message', 'code', 'source']} bordered={false} collapsible="disabled"  ghost={true}>
            <Collapse.Panel key="message" header="Message" showArrow={false}>{this.props.error.message}</Collapse.Panel>
            <Collapse.Panel key="code" header="Code" showArrow={false}>{this.props.error.code}</Collapse.Panel>
            <Collapse.Panel key="source" header="Source" showArrow={false}>{this.props.error.source}</Collapse.Panel>

            {this.renderDetail()}
        </Collapse>;
    }

    render() {
        return (
            <Alert type="error" message={this.renderTitle()} description={this.renderBody()}></Alert>
        );
    }
}