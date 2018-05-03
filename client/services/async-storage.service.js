import {AsyncStorage} from 'react-native'

export default class AsyncStorageService {

    constructor() {
        this.USERNAME_KEY = 'username';
        this.PASSWORD_KEY = 'password';
        this.JWT_KEY = 'jwt';
        this.WATCH_ID = 'watch_id';
    }

    setJwt(jwt) {
        return AsyncStorage.setItem(this.JWT_KEY, jwt);
    }

    setUser(username, password) {
        AsyncStorage.setItem(this.USERNAME_KEY, username);
        AsyncStorage.setItem(this.PASSWORD_KEY, password);
    }

    setWatchId(watchId) {
        AsyncStorage.setItem(this.WATCH_ID, watchId);
    }

    getJwt() {
        return AsyncStorage.getItem(this.JWT_KEY);
    }

    getUser() {
        return Promise.all([
            AsyncStorage.getItem(this.USERNAME_KEY),
            AsyncStorage.getItem(this.PASSWORD_KEY)
        ]);
    }

    getWatchId() {
        return AsyncStorage.getItem(this.WATCH_ID);
    }
}