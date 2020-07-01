import React from 'react';
import './SourceInfo.css';
import { Tooltip } from 'antd';
import { DataSourceInfo } from '../lib/model';

export interface SourceInfoProps {
    dataSourceInfo: DataSourceInfo;
}

interface SourceInfoState { }

export default class SourceInfo extends React.Component<SourceInfoProps, SourceInfoState> {
    renderSourceInfo() {
        return (
            <div className="Row">
                <div className="Col-auto" style={{ marginRight: '10px' }}>
                    <img src={this.props.dataSourceInfo.logo_url}
                        style={{ height: '64px' }}
                        alt={this.props.dataSourceInfo.title + ' logo'} />
                </div>
                <div className="Col">
                    <div className="InfoTable">
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Source
                            </div>
                            <div className="InfoTable-dataCol">
                                <a
                                    href={this.props.dataSourceInfo.home_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {this.props.dataSourceInfo.title}
                                </a>
                            </div>
                        </div>
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Data
                            </div>
                            <div className="InfoTable-dataCol">
                                <Tooltip title={this.props.dataSourceInfo.data_url}>
                                    <a
                                        href={this.props.dataSourceInfo.data_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {this.props.dataSourceInfo.data_url}
                                    </a>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

    render() {
        return this.renderSourceInfo();
    }
}
