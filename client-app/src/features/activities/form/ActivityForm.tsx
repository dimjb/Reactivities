import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { ActivityFormValues } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { categories } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { combineDateAndTime } from '../../../app/common/util/util';
import { action } from 'mobx';
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
	title: isRequired({ message: 'Event title is required!' }),
	category: isRequired('Category'),
	description: composeValidators(
		isRequired('Description'),
		hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 chars!' })
	)(),
	city: isRequired('City'),
	venue: isRequired('Venue'),
	date: isRequired('Date'),
	time: isRequired('Time')
});

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const rootStore = useContext(RootStoreContext);
    const {createActivity, editActivity, submitting, loadActivity} = rootStore.activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then(action((activity) => setActivity(new ActivityFormValues(activity))))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match]);

    const handleFinalFormSubmit = (values: any) => {
        const dateTime = combineDateAndTime(values.date, values.time);
        const { date, time, ...activity } = values;
        activity.date = dateTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }

    }

    const { id, title, description, category, date, time, city, venue } = activity;
    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field name='title' component={TextInput}
                                    placeholder='Title' value={title} />

                                <Field name='description' component={TextAreaInput}
                                    placeholder='Description' value={description} />

                                <Field name='category' component={SelectInput}
                                    options={categories}
                                    placeholder='Category' value={category} />
                                <Form.Group widths='equal'>
                                    <Field name='date' component={DateInput}
                                        placeholder='Date' value={date} date={true} />
                                    <Field name='time' component={DateInput}
                                        placeholder='Time' value={time} time={true} />
                                </Form.Group>

                                <Field name='city' component={TextInput}
                                    placeholder='City' value={city} />

                                <Field name='venue' component={TextInput}
                                    placeholder='Venue' value={venue} />
                                <Button disabled={loading || invalid || pristine}
                                    loading={submitting} floated='right' positive type='submit' content='Submit' />
                                <Button disabled={loading}
                                    onClick={() => !id ?
                                        history.push('/activities') :
                                        history.push(`/activities/${id}`)} floated='right' type='button' content='Cancel' />
                            </Form>
                        )}
                    />

                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ActivityForm);
