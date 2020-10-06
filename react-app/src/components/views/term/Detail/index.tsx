import React from 'react';
import './style.css';
import { OntologyTermRecord } from '../../../../types/ontology';
import TermLink from '../TermLink';
import LinkedObjects from '../LinkedObjects';
import Children from '../Children';
import AncestorGraph from '../AncestorGraph';
import { Tabs } from 'antd';
import LinkedObjectsAndFeatures from '../LinkedObjectsAndFeatures';
import { Synonym } from '../../../../types/metadata';
import { Source } from '../../../../lib/OntologyAPIClient';
import { MetadataFieldView } from '../MetadataFieldView';

const width = '8em';

export interface DetailProps {
    item: OntologyTermRecord;
    source: Source;
}

interface DetailState {
}

export default class Detail extends React.Component<DetailProps, DetailState> {
    renderSynonyms(synonyms: Array<Synonym>) {
        if (synonyms.length === 0) {
            return <i>-</i>;
        }
        return synonyms.map((s, index) => {
            return (
                <div key={String(index)}>
                    {s}
                </div>
            );
        });
    }

    renderComments() {
        if (this.props.item.comments.length === 0) {
            return <i>-</i>;
        }

        return this.props.item.comments.map((comment, index) => {
            const comments = comment.split('\n');
            return comments.map((comment, index2) => {
                return <p key={String(index) + '-' + String(index2)}>{comment}</p>;
            });
        });
    }

    renderDetail() {
        return (
            <div>
                <div className="InfoTable DetailTable">
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            ID
                    </div>
                        <div className="InfoTable-dataCol">
                            <TermLink item={this.props.item} newWindow={true} source={this.props.source} />
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Name
                    </div>
                        <div className="InfoTable-dataCol">
                            {this.props.item.name}
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Definition
                    </div>
                        <div className="InfoTable-dataCol">
                            {this.props.item.definition}
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Comments
                    </div>
                        <div className="InfoTable-dataCol">
                            {this.renderComments()}
                        </div>
                    </div>
                    <div className="InfoTable-row">
                        <div className="InfoTable-labelCol">
                            Metadata
                        </div>
                        <div className="InfoTable-dataCol">

                        </div>
                    </div>
                    {this.renderMetadata()}
                </div>
            </div>
        );
    }

    renderMetadata() {
        const metadata = this.props.item.metadata;

        if (metadata.length === 0) {
            return <div style={{ fontStyle: 'italic' }}>
                No metadata available for {this.props.source.title} taxa
            </div>;
        }

        return metadata.map((metadatum) => {
            return <div className="InfoTable-row" key={metadatum.id}>
                <div className="InfoTable-labelCol" style={{ width }}>
                    {metadatum.label}
                </div>
                <div className="InfoTable-dataCol">
                    <MetadataFieldView field={metadatum} />
                </div>
            </div>;
        });
    }


    // TODO: restore through METADATA
    // renderAllSynonyms() {
    //     const item = this.props.item;
    //     if (item.type === OntologySource.ENVO) {
    //         return <i>Synonyms not available for ENVO Ontology</i>;
    //     }
    //     return (
    //         <div className="InfoTable DetailTable">
    //             <div className="InfoTable-row">
    //                 <div className="InfoTable-labelCol">
    //                     exact
    //                     </div>
    //                 <div className="InfoTable-dataCol">
    //                     {this.renderSynonyms(item.synonyms.exact)}
    //                 </div>
    //             </div>
    //             <div className="InfoTable-row">
    //                 <div className="InfoTable-labelCol">
    //                     narrow
    //                             </div>
    //                 <div className="InfoTable-dataCol">
    //                     {this.renderSynonyms(item.synonyms.narrow)}
    //                 </div>
    //             </div>
    //             <div className="InfoTable-row">
    //                 <div className="InfoTable-labelCol">
    //                     broad
    //                             </div>
    //                 <div className="InfoTable-dataCol">
    //                     {this.renderSynonyms(item.synonyms.broad)}
    //                 </div>
    //             </div>
    //             <div className="InfoTable-row">
    //                 <div className="InfoTable-labelCol">
    //                     related
    //                             </div>
    //                 <div className="InfoTable-dataCol">
    //                     {this.renderSynonyms(item.synonyms.related)}
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }
    renderGraph() {
        return (
            <AncestorGraph termRef={this.props.item.ref} />
        );
    }
    renderLinkedObjects() {
        return (
            <LinkedObjects termRef={this.props.item.ref} />
        );
        // return (
        //     <LinkedObjects linkedObjects={[]} />
        // );
    }
    renderLinkedObjectsAndFeatures() {
        return (
            <LinkedObjectsAndFeatures termRef={this.props.item.ref} />
        );
    }

    renderChildren() {
        return <Children
            termRef={this.props.item.ref}
        />;
    }



    render() {
        return <Tabs
            className="FullHeight-tabs"
            animated={false}
            type="card">
            <Tabs.TabPane tab="Detail" key="detail" forceRender={false}>
                <div className="Col" style={{ overflowY: 'auto', paddingTop: '10px' }}>
                    {this.renderDetail()}
                </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Graph" key="graph" forceRender={false}>
                {this.renderGraph()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Children" key="children" forceRender={false}>
                {this.renderChildren()}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Linked Data" key="linkedObjects" forceRender={false}>
                {this.renderLinkedObjectsAndFeatures()}
            </Tabs.TabPane>
        </Tabs>;
    }
}