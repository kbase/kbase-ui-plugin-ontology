import React from "react";
import './SubSection.css';

export interface SubSectionProps {
    title: string;
    renderToolbar?: () => JSX.Element;
}

interface SubSectionState {

}

export default class SubSection extends React.Component<SubSectionProps, SubSectionState> {
    renderToolbar() {
        if (!this.props.renderToolbar) {
            return;
        }
        return this.props.renderToolbar();
    }

    render() {
        return <div className="SubSection">
            <div className="SubSection-header">
                <div className="SubSection-title">{this.props.title}</div>
                <div>{this.renderToolbar()}</div>
            </div>
            <div className="SubSection-body">
                {this.props.children}
            </div>
        </div>;

    }
}