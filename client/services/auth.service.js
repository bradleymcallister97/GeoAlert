import RequestService from './request.service';
import AsyncStorageService from './async-storage.service';

export default class Auth {
    constructor() {
        // get url from config
        this.url = '';
        this.requestService = new RequestService();
        this.asyncStorageService = new AsyncStorageService();
    }

    login(username, password) {
        return this.requestService.request(this.url + '/login', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((result) => {
            if (result.status !== 200) {
                throw result.message;
            }
            this.asyncStorageService.setUser(username, password);
            return this.asyncStorageService.setJwt(result.token);
        }).then(() => {
            return true;
        });
    }

    register(username, password) {
        return this.requestService.request(this.url + '/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then((result) => {
            if (result.status !== 201) {
                throw result.message;
            }
            return result;
        });
    }

    verify() {
        return this.requestService.request(this.url + '/verify', {
            method: 'GET'
        }).then((result) => {
            if (result.status === 200) {
                return true;
            }
            return false;
        });
    }
}