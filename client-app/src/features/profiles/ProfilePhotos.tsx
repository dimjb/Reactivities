import React, { useContext, useState } from 'react';
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget';
import { observer } from 'mobx-react-lite';

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser, uploadPhoto, uploadingPhoto, setMainPhoto, deletePhoto, loading } = rootStore.profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [mainTarget, setMainTarget] = useState<string | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

    const handleUploadImage = (photo: Blob, fileName: string) => {
        uploadPhoto(photo, fileName).then(() => setAddPhotoMode(false));
    }
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser &&
                        <Button onClick={() => setAddPhotoMode(!addPhotoMode)}
                            floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'} />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={uploadingPhoto} />
                    ) : (
                            <Card.Group itemsPerRow={5}>
                                {profile && profile.photos.map(photo => (
                                    <Card key={photo.id}>
                                        <Image src={process.env.REACT_APP_API_ROOT_URL+photo.url} />
                                        {isCurrentUser &&
                                            <Button.Group fluid widths={2}>
                                                <Button onClick={e => {
                                                    setMainPhoto(photo);
                                                    setMainTarget(e.currentTarget.name)
                                                }} loading={loading && mainTarget === photo.id}
                                                name={photo.id} disabled={photo.isMain}
                                                basic positive content='Main' />
                                                
                                                <Button onClick={e => {
                                                    setMainTarget(undefined);
                                                    deletePhoto(photo);
                                                    setDeleteTarget(e.currentTarget.name)
                                                }}
                                                loading={loading && deleteTarget === photo.id}
                                                name={photo.id} disabled={photo.isMain} 
                                                basic negative icon='trash' />
                                            </Button.Group>
                                        }
                                    </Card>
                                ))}
                            </Card.Group>
                        )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfilePhotos);
