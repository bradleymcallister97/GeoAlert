import AsyncStorageService from './async-storage.service';

export default class RequestService {

    constructor() {
        this.asyncStorageService = new AsyncStorageService();
    }

    request(url, options) {
        return this.asyncStorageService.getJwt().then((jwt) => {
            var headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + jwt
            };
            options.headers = headers;
            return fetch(url, options);
        }).then((result) => {
            return Promise.all([result.json(), result.status]);
        }).then(([body, status]) => {
            body.status = status;
            return body;
        });
    }
}