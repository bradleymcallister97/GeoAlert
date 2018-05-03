
export default class GeoLocation {

    constructor() {}

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => reject(error),
                {
                    enableHighAccuracy: false,
                    timeout: 3000,
                    maximumAge: 5000
                }
            );
        });
    }

    watchPosition(success, error, options) {
        return navigator.geolocation.watchPosition(success, error, options);
    }

    clearWatch(watchId){
        navigator.geolocation.clearWatch(watchId);
    }
}
