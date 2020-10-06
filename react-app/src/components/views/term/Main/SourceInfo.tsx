import React from 'react';
import './SourceInfo.css';
import { Tooltip } from 'antd';
import { Source } from '../../../../lib/OntologyAPIClient';

export interface SourceInfoProps {
    source: Source;
}

interface SourceInfoState { }

export default class SourceInfo extends React.Component<SourceInfoProps, SourceInfoState> {
    renderSourceInfo() {
        return (
            <div className="Row">
                <div className="Col-auto" style={{ marginRight: '10px' }}>
                    <img src={this.props.source.logo_url}
                        style={{ height: '64px' }}
                        alt={this.props.source.title + ' logo'} />
                </div>
                <div className="Col">
                    <div className="InfoTable">
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Source
                            </div>
                            <div className="InfoTable-dataCol">
                                <a
                                    href={this.props.source.home_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {this.props.source.title}
                                </a>
                            </div>
                        </div>
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Data
                            </div>
                            <div className="InfoTable-dataCol">
                                <Tooltip title={this.props.source.data_url}>
                                    <a
                                        href={this.props.source.data_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {this.props.source.data_url}
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
