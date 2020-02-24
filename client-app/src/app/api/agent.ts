import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity';
import { IUser, IUserFormValues } from '../models/user';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IProfile, IPhoto } from '../models/profile';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
	const token = localStorage.getItem('jwt');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
}, error => {
	return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error');
    }
    const {status, data: {errors}, config: {method}, headers} = error.response;
    if (status === 404) {
        history.push('/notfound');
    }

    if (status === 401 && headers['www-authenticate'].includes('Bearer error="invalid_token"')) {
        localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired! Please login again.');
    }

    if (status === 400 && method === 'get' && errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }

    if (status === 500) {
        toast.error('Server error');
    }
    
    throw error.response;
});

const resBody = (res: AxiosResponse) => res.data;

const requests = {
    get: (url: string) => axios.get(url).then(resBody),
    post: (url: string, body: {}) => axios.post(url, body).then(resBody),
    put: (url: string,  body: {}) => axios.put(url, body).then(resBody),
    delete: (url: string) => axios.delete(url).then(resBody),
    postForm: (url: string, file: Blob, fileName: string) => {
        let formData = new FormData();
        formData.append('File', file, fileName);
        return axios.post(url, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(resBody)
    }
}

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => 
        axios.get('/activities', {params: params}).then(resBody),
    details: (id: string): Promise<IActivity> => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => requests.delete(`/activities/${id}/attend`)
}

const User = {
	current: (): Promise<IUser> => requests.get('/user'),
	login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
	register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user)
}

const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    uploadPhoto: (photo: Blob, fileName: string): Promise<IPhoto> => requests.postForm('/photos', photo, fileName),
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<IProfile>) => requests.put('/profiles', profile),
    follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => requests.delete(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: string) => 
    requests.get(`/profiles/${username}/followings?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => 
    requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
}

export default {
    Activities,
    User,
    Profiles
}