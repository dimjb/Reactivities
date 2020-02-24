import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';
import { Link } from 'react-router-dom';

const styles = {
    border: '2px dotted teal'
}

const ActivityListItemAttendees: React.FC<{attendees: IAttendee[]}> = ({attendees}) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item key={attendee.username}>
                    <Popup
                        header={attendee.displayName}
                        trigger={
                        <Image as={Link} to={`/profile/${attendee.username}`} size='mini' circular bordered style={attendee.following ? styles : null}
                        src={attendee.image && process.env.REACT_APP_API_ROOT_URL+attendee.image || '/assets/user.png'} />
                        }
                    />           
                </List.Item>
            ))}
        </List>
    )
}

export default ActivityListItemAttendees;
