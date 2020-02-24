import React from 'react';
import { IActivity } from '../../../app/models/activity';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { format } from 'date-fns';

const ActivityDetailedInfo: React.FC<{ activity: IActivity }> = ({ activity: { description, date, venue, city } }) => {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{description}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            {format(date, 'eeee do MMMM')} at {format(date, 'h:mm a')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <span>{venue}, {city}</span>
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
}

export default ActivityDetailedInfo;
