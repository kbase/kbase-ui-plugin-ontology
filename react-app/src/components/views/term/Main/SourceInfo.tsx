import React from 'react';
import './SourceInfo.css';
import { Button, Modal, Tooltip } from 'antd';
import { Source } from '../../../../lib/OntologyAPIClient';
import marked from 'marked';

export interface SourceInfoProps {
    source: Source;
}

interface SourceInfoState {
    showCitation: boolean;
}

export default class SourceInfo extends React.Component<SourceInfoProps, SourceInfoState> {
    constructor(props: SourceInfoProps) {
        super(props);
        this.state = {
            showCitation: false
        };
    }
    renderCitation() {
        const citation = marked(this.props.source.citation);
        const footer = <div style={{ textAlign: 'center' }}>
            <Button onClick={() => { this.setState({ showCitation: false }); }}>
                close
            </Button>
        </div>;
        return <div>
            <Button
                type="default"
                size="small"
                style={{ margin: 0 }}
                onClick={(e) => {
                    this.setState({ showCitation: true });
                }}>
                show
            </Button>
            <Modal title={`${this.props.source.short_title} Citation`}
                visible={this.state.showCitation}
                closable={true}
                footer={footer}
            >
                <div dangerouslySetInnerHTML={{ __html: citation }} />
            </Modal>
        </div>;
    }
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
                        <div className="InfoTable-row">
                            <div className="InfoTable-labelCol" style={{ width: '5em' }}>
                                Citation
                            </div>
                            <div className="InfoTable-dataCol">
                                {this.renderCitation()}
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
