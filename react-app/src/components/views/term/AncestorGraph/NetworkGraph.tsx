import React from 'react';
import { Network, Node, Edge, Options } from 'vis-network/peer';
import { DataSet } from 'vis-data/peer';
import 'vis-network/dist/dist/vis-network.css';
import './NetworkGraph.css';

export interface NetworkNode {
    id: string;
    label: string;
    isTerm: boolean;
    isRoot: boolean;
    isSelected: boolean;
}
export interface NetworkEdge {
    from: string;
    to: string;
    label: string;
}

export interface NetworkData {
    nodes: Array<NetworkNode>;
    edges: Array<NetworkEdge>;
}

export interface NetworkGraphProps {
    data: NetworkData;
    selectedNodeID: string | null;
    height: string;
    selectNodeID: (nodeID: string) => void;
}

interface NetworkGraphState {
}

export default class NetworkGraph extends React.Component<NetworkGraphProps, NetworkGraphState> {
    networkGraphNode: React.RefObject<HTMLDivElement>;
    graphNode: React.RefObject<HTMLDivElement>;
    network?: Network;
    constructor(props: NetworkGraphProps) {
        super(props);
        this.graphNode = React.createRef();
        this.networkGraphNode = React.createRef();
    }

    mountGraph() {
        if (this.graphNode.current === null) {
            return;
        }
        const nodes = new DataSet<Node, 'id'>({});
        nodes.add(this.props.data.nodes.map((term) => {
            let color: string;
            if (term.isTerm) {
                color = 'red';
            } else {
                color = 'black';
            }
            if (term.isRoot) {
                color = 'green';
            }
            return {
                id: term.id,
                label: term.label,
                color: {
                    border: color
                },
                shape: term.isRoot || term.isTerm ? 'ellipse' : 'box',
                // fixed: term.isTerm || term.isRoot,
                // y: term.isTerm ? 800 : (term.isRoot ? 0 : undefined)
            };
        }));
        const edges = new DataSet<Edge, 'id'>({});
        edges.add(this.props.data.edges.map((e) => {
            return {
                from: e.from,
                to: e.to,
                arrows: 'to',
                label: e.label
            };
        }));


        const graphHeight = '400px';
        const options: Options = {
            layout: {
                hierarchical: {
                    enabled: true,
                    direction: 'DU',
                    sortMethod: 'directed',
                    nodeSpacing: 300
                }
            },
            physics: false,
            height: graphHeight,
            // autoResize: true,
            // width: '100%',
            // height: '100%'
            nodes: {
                color: {
                    highlight: {
                        border: 'blue',
                        background: 'rgb(204, 255, 255, 1)'
                    }
                },
                margin: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            interaction: {
                navigationButtons: true,
                dragView: true
            }
        };

        this.network = new Network(this.graphNode.current, { nodes, edges }, options);
        this.network.fit();
        this.network.on('selectNode', ({ nodes: [nodeID] }) => {
            this.props.selectNodeID(nodeID);
        });
        if (this.props.selectedNodeID) {
            this.network.selectNodes([this.props.selectedNodeID]);
        }
    }

    componentDidMount() {
        this.mountGraph();

        window.addEventListener('resize', () => {
            this.onResize();
        });
        this.onResize();
    }

    onResize() {
        let graphHeight: string;
        if (this.networkGraphNode.current) {
            graphHeight = (this.networkGraphNode.current.clientHeight) + 'px';
        } else {
            graphHeight = '400px';
        }
        if (this.network) {
            this.network.setSize('100%', graphHeight);
            this.network.redraw();
        }
    }

    componentDidUpdate() {
        if (this.props.selectedNodeID && this.network) {
            this.network.selectNodes([this.props.selectedNodeID]);
        }
    }

    render() {
        return <div ref={this.networkGraphNode} className="NetworkGraph">
            <div ref={this.graphNode} className="NetworkGraph-graphWrapper">

            </div>
        </div>;
    }
}