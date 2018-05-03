import RequestService from './request.service';

export default class AlertService {
    constructor() {
        this.requestService = new RequestService();
        // get url from config
        this.url = '';
    }

    getAlerts(lat, long, range, sort, limit, activated, inRange) {
        var query = [];
        var queryStr = '';

        if (lat) query.push('lat=' + lat);
        if (long) query.push('long=' + long);
        if (range) query.push('range=' + range);
        if (sort) query.push('sort=' + sort);
        if (limit) query.push('limit=' + limit);
        if (activated) query.push('activated=' + activated);
        if (inRange) query.push('inRange=' + inRange);

        if (query.length > 0){
            queryStr = '?' + query.join('&');
        }

        return this.requestService.request(this.url + '/alert' + queryStr, { method: 'GET' }).then((result) => {
            if (result.status === 200) {
                return result;  
            } else {
                throw result.message;                              
            }
        });
    }

    createAlert(name, message, longitude, latitude) {
        return this.requestService.request(this.url + '/alert', {
            method: 'POST',
            body: JSON.stringify({
                name: name,
                message: message,
                longitude: longitude,
                latitude: latitude,
                activated: false
            })
        }).then((result) => {
            if (result.status === 201) {
                return result;
            }
            throw result.message;
        });
    }

    updateAlert(id, name, message, longitude, latitude, activated){
        let body = {};
        if (name) body.name = name;
        if (message) body.message = message;
        if (longitude) body.longitude = longitude;
        if (latitude) body.latitude = latitude;
        if (activated) body.activated = activated;
        return this.requestService.request(this.url + '/alert/' + id, {
            method: 'PATCH',
            body: JSON.stringify(body)
        }).then((result) => {
            if (result.status === 200) {
                return result;
            }
            throw result.message;
        });
    }

    deleteAlert(id){
        return this.requestService.request(this.url + '/alert/' + id, {
            method: 'DELETE'
        }).then((result) => {
            if (result.status === 204) {
                return true;
            }
            throw result.message;
        });
    }
}