import React from 'react';
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import {format} from 'date-fns';
import ActivityListItemAttendees from './ActivityListItemAttendees';

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity: { id, title, date, 
    description, city, venue, attendees, isHost, isGoing } }) => {
    const host = attendees.filter(x => x.isHost)[0];
    
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image && process.env.REACT_APP_API_ROOT_URL+host.image || '/assets/user.png'}
                        style={{marginBottom: 3}} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${id}`}>{title}</Item.Header>
                            <Item.Description>Hosted by <Link to={`/profile/${host.username}`}>{host.displayName}</Link></Item.Description>
                            {isHost &&
                                <Item.Description>
                                    <Label basic color='orange'
                                    content='You are hosting this activity' />
                                </Item.Description>}
                            {isGoing && !isHost &&
                                <Item.Description>
                                    <Label basic color='green'
                                    content='You are going to this activity' />
                                </Item.Description>}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(date, 'h:mm a')} 
                <Icon name='marker' /> {venue}, {city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={attendees} />
            </Segment>
            <Segment clearing>
                <span>{description}</span>
                <Button as={Link} to={`/activities/${id}`} floated='right' content='View' color='blue' />
            </Segment>
        </Segment.Group>
    )
}

export default ActivityListItem;
