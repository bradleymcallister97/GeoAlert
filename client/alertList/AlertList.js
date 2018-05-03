import React from 'react';
import { Text, View, Button, Dimensions, FlatList, TouchableOpacity } from 'react-native';
const { width } = Dimensions.get('window');
import AlertRow from './AlertRow';
import AlertService from '../services/alerts.service';
import Auth from '../services/auth.service';
import AsyncStorageService from '../services/async-storage.service';

export default class AlertList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            geoAlerts: [
            ],
            refreshing: false,
            error: null
        };

        this.alertService = new AlertService();
        this.auth = new Auth();
        this.asyncStorageService = new AsyncStorageService();

        this.selectAlert = this.selectAlert.bind(this);
        this.getAlerts = this.getAlerts.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Alerts',
        headerLeft: (
            <Button
                onPress={() => navigation.navigate('CreateAlert')}
                title="+"
            />
        ),
        headerRight: (
            <Button
                onPress={() => navigation.navigate('Login')}
                title="Sign Out"
            />
        )
    });

    selectAlert(alert) {
        this.props.navigation.navigate('AlertDetails', alert);
    }

    getAlerts() {
        this.setState({refreshing: true});
        this.alertService.getAlerts().then((result) => {
            this.setState({geoAlerts: result});
        }).catch((err) => {
            this.setState({error: err.message});
        }).finally(() => {
            this.setState({refreshing: false});
        });
    }

    signOut() {
        // Clear JWT token
        this.asyncStorageService.setJwt('');
        this.props.navigation.navigate('Login', alert);
    }

    componentWillMount() {
        this.setState({refreshing: true});
        this.auth.verify().then((isLoggedIn) => {
            if (!isLoggedIn) {
                return this.asyncStorageService.getUser().then(([username, password]) => {
                    return this.auth.login(username, password).catch((err) => {
                        this.props.navigation.navigate('Login', alert);
                    });
                });
            }
            return null;
        }).then((result) => {
            return this.alertService.getAlerts();
        }).then((result) => {
            this.setState({geoAlerts: result});
        }).catch((err) => {
            this.setState({error: err.message});
        }).finally(() => {
            this.setState({refreshing: false});
        });
    }

    render() {
        return (
            <FlatList
                data={this.state.geoAlerts}
                renderItem={({ item }) => <TouchableOpacity onPress={() => this.selectAlert(item)}><AlertRow alert={item} /></TouchableOpacity>}
                keyExtractor={(item, index) => index}
                ListEmptyComponent={<Text>You have no alerts</Text>}
                refreshing={this.state.refreshing}
                onRefresh={this.getAlerts}
            />
        );
    }
}
