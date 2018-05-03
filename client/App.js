import React from 'react';
import { StackNavigator } from 'react-navigation';
import Login from './login/Login';
import AlertList from './alertList/AlertList';
import AlertDetails from './alertDetails/AlertDetails';
import CreateAlert from './createAlert/CreateAlert';
import CreateAccount from './login/CreateAccount';
import BackgroundTask from 'react-native-background-task'
import GeoLocation from './services/geo.service';
import AsyncStorageService from './services/async-storage.service';
import Task from './task/backgroundTask';

const RootStack = StackNavigator(
    {
        Login: {
            screen: Login,
        },
        AlertList: {
            screen: AlertList,
        },
        AlertDetails: {
            screen: AlertDetails
        },
        CreateAlert: {
            screen: CreateAlert
        },
        CreateAccount: {
            screen: CreateAccount
        }
    },
    {
        initialRouteName: 'AlertList',
    }
);

BackgroundTask.define(() => {
    const geoLocation = new GeoLocation();
    const asyncStorageService = new AsyncStorageService();
    asyncStorageService.getWatchId().then((watchId) => {
        geoLocation.clearWatch(watchId);
        let watchId = geoLocation.watchPosition(
            (position) => {
                Task(position.coords.latitude, position.coords.longitude);
            }
        );
        asyncStorageService.setWatchId(watchId);
    });
    BackgroundTask.finish();
});


export default class App extends React.Component {

    componentWillMount() {
        BackgroundTask.schedule({
            period: 86400, // 24 hours
            timeout: 30
        });
    }

    render() {
        return (
            <RootStack />
        );
    }
}
