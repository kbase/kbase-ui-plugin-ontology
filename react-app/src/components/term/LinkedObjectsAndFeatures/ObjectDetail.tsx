import React from 'react';
import { ObjectInfo } from '../lib/model';
import styles from './ObjectDetail.module.css';
import { Alert } from 'antd';
import { NiceRelativeTime } from '@kbase/ui-components';

export interface ObjectDetailProps {
    objectInfo: ObjectInfo | null;
}

interface ObjectDetailState { }

export default class ObjectDetail extends React.Component<ObjectDetailProps, ObjectDetailState> {
    renderEmpty() {
        return <div
            className="Row"
            style={{
                // backgroundColor: 'rgba(200, 200, 200, 0.5)',
                position: 'relative'
            }}>
            <div style={{
                position: 'absolute',
                left: 0, top: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}>
                <Alert
                    type="info"
                    message={<p>Select an object to show its detail...</p>}
                    style={{ width: '40em', margin: '10px auto' }}
                />

            </div>
            <div className="Col InfoTable">
                <div>
                    <div className={styles.LabelCol}>
                        Name
                </div>
                    <div className={styles.EmptyCell}>

                    </div>
                </div>
                <div>
                    <div className={styles.LabelCol}>
                        Type
                </div>
                    <div className={styles.EmptyCell}>

                    </div>
                </div>
            </div>
            <div className="Col InfoTable">
                <div>
                    <div className={styles.LabelCol}>
                        Saved
                </div>
                    <div className={styles.EmptyCell}>

                    </div>
                </div>
                <div>
                    <div className={styles.LabelCol}>
                        By
                </div>
                    <div className={styles.EmptyCell}>

                    </div>
                </div>
            </div>
        </div>;
    }


    renderObjectInfo(objectInfo: ObjectInfo) {
        const [
            id, name, type, savedDate, version,
            savedBy, workspaceId, /* checksum */,
            /* size */, /* metadata */
        ] = objectInfo;
        const ref = `${workspaceId}/${id}/${version}`;
        return <div className="Row">
            <div className="Col InfoTable">
                <div>
                    <div className={styles.LabelCol}>
                        Name
                    </div>
                    <div>
                        <a href={`/#dataview/${ref}ref`} target="_blank" rel="noopener noreferrer">{name}</a>
                    </div>
                </div>
                <div>
                    <div className={styles.LabelCol}>
                        Type
                    </div>
                    <div>
                        <a href={`/#spec/type/${type}`}>{type}</a>
                    </div>
                </div>
            </div>
            <div className="Col InfoTable">
                <div>
                    <div className={styles.LabelCol}>
                        Saved
                    </div>
                    <div>
                        <NiceRelativeTime time={new Date(savedDate)} />

                    </div>
                </div>
                <div>
                    <div className={styles.LabelCol}>
                        By
                    </div>
                    <div>
                        <a href={`/#user/${savedBy}`} target="_blank" rel="noopener noreferrer">{savedBy}</a>
                    </div>
                </div>
            </div>
        </div>;
    }


    render() {
        if (this.props.objectInfo) {
            return this.renderObjectInfo(this.props.objectInfo);
        }
        return this.renderEmpty();
    }

}