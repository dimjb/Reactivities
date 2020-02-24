import React, { Fragment } from 'react';
import { Segment, List, Item, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IAttendee } from '../../../app/models/activity';
import { observer } from 'mobx-react-lite';

const ActivityDetailedSidebar: React.FC<{ attendees: IAttendee[] }> = ({ attendees }) => {
  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(attendee => (
            <Item key={attendee.username} style={{ position: 'relative' }}>
              {attendee.isHost &&
              <Label
                style={{ position: 'absolute' }}
                color='orange'
                ribbon='right'
              >
                Host
              </Label>}
              <Image size='tiny' src={attendee.image&& process.env.REACT_APP_API_ROOT_URL+attendee.image || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={`/profile/${attendee.username}`}>{attendee.displayName}</Link>
                </Item.Header>
                {attendee.following &&
                <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
              </Item.Content>
            </Item>
          ))}

        </List>
      </Segment>
    </Fragment>
  )
}

export default observer(ActivityDetailedSidebar);
