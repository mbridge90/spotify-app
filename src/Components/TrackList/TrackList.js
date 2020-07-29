import React from 'react';
import Track from '../Track/Track';

class TrackList extends React.Component {
    constructor(props){
        super(props);
        this.counter = 0;
    }

    render() {
        return (
            <div className="TrackList">
                { this.props.tracks.map(track => {
                    return <Track onAdd={this.props.onAdd} track={track} key={track.id}
                                    onRemove={this.props.onRemove}
                                    isRemoval={this.props.isRemoval}/>
                })}
            </div>
        )
    }
}

export default TrackList