# GeoAlert
App that allows users to create, update, get and delete reminder alerts which are trigger based on users location

Repo is divided into two sections __ms__ and __client__

## ms
This is the microservice folder. It contains auth and geoAlerts. Both microservices use MongoDB as their database.

### Auth ([swagger](https://github.com/bradleymcallister97/GeoAlert/blob/master/ms/auth/swagger.yml))
The auth mircoservice is in charge of creating, logging in and verifying sessions for users. 

Once a user is created they are allowed to login. After a successful login the user will be given a [JWT](https://jwt.io/) token. This token will give the user access to the other available mircoservices.

The user can also send a verify request to check and see if their token is still valid.

### GeoAlerts ([swagger](https://github.com/bradleymcallister97/GeoAlert/blob/master/ms/geoAlerts/swagger.yml))
The geoAlerts mircoservice allows authenticated users to [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) their alerts.

### Improvements
Currently the authentication is done on each of the microservices. This was done since it was the simplest solution. A much better solution would be to use an API gateway, like [Kong](https://getkong.org/). The gateway would authenticate all requests before dispatching them to a mircoservice.

## client
The client is a react-native app. The app provides the user with a interactive interface for managing their alerts.

The app runs a task in the background which will send the user notifications based on their location.

### Improvements
Implement native feature for iPhone and Android, for better user experience.
