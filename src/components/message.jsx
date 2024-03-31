import React from 'react';
import './message.css'

class message extends React.Component {

    render() {
        const d = new Date("2016-07-27T07:45:00Z");
        const date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
        if (this.props.sendBy === this.props.currentUser) {
            return (
                <p className="messageContainerSelf">
                    <div className="messageText">{this.props.message}</div>
                    <div className="messageTime">{date}</div>
                </p>
            )

        } else {
            return (
                <p className="messageContainerOther">
                    <p className="messageText">{this.props.message}</p>
                    <p className="messageTime">{date}</p>
                </p>
            )
        }
    }
}

export default message;