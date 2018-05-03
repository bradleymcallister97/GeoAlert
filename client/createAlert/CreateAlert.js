import React from 'react';
import { TextInput, Text, View, StyleSheet, Dimensions, Button } from 'react-native';
const { width } = Dimensions.get('window');
import GeoLocation from '../services/geo.service';
import AlertService from '../services/alerts.service';

export default class CreateAlert extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            message: '',
            latitude: null,
            longitude: null,
            error: null
        };

        this.geoLocation = new GeoLocation();
        this.alertService = new AlertService();
        
        this.getCurrentLocation = this.getCurrentLocation.bind(this);
        this.create = this.create.bind(this);
    }

    getCurrentLocation() {
        this.geoLocation.getCurrentLocation().then((position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null
            });
        }).catch((error) => {
            this.setState({ error: error.message });
        });
    }

    create() {
        const { name, message, latitude, longitude } = this.state;
        if (!name) {
            this.setState({
                error: 'Name is required'
            });
        } else if (!latitude || !longitude) {
            this.setState({
                error: 'Location is required'
            });
        } else {
            this.alertService.createAlert(name, message, longitude, latitude).then((result) => {
                this.props.navigation.navigate('AlertList');
            }).catch((err) => {
                this.setState({ error: err });
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>Create Alert</Text>
                <TextInput
                    name="name"
                    placeholder="Name"
                    value={this.state.name}
                    style={styles.input}
                    onChangeText={(name) => this.setState({ name })}
                />
                <TextInput
                    name="message"
                    placeholder="Message"
                    value={this.state.message}
                    style={styles.input}
                    onChangeText={(message) => this.setState({ message })}
                />
                {this.state.error ? <Text style={styles.error}>Error: {this.state.error}</Text> : null}
                {this.state.latitude ? <Text style={styles.detailsText}>Latitude: {this.state.latitude}</Text> : null}
                {this.state.longitude ? <Text style={styles.detailsText}>Longitude: {this.state.longitude}</Text> : null}
                <Button
                    onPress={this.getCurrentLocation}
                    title="Get Current Location"
                />
                <Button
                    onPress={this.create}
                    title="Create"
                />
            </View>
        );
    }
}

const ELEMENT_WIDTH = width - 80;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginLeft: 20
    },
    input: {
        width: ELEMENT_WIDTH,
        fontSize: 20,
        height: 40,
        paddingBottom: 15
    },
    mainText: {
        fontSize: 40,
        paddingBottom: 20
    },
    detailsText: {
        fontSize: 20
    },
    error: {
        color: 'red'
    }
});
