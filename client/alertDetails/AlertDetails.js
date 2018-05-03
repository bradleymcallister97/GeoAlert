import React from 'react';
import { Text, View, Button, TextInput, StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import AlertService from '../services/alerts.service';

export default class AlertDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
            name: '',
            message: '',
            longitude: null,
            latitude: null,
            error: null
        };

        this.alertService = new AlertService();

        this.update = this.update.bind(this);
    }
    
    componentWillMount(){
        const alert = this.props.navigation.state.params;
        this.setState({
            id: alert._id,
            name: alert.name,
            message: alert.message,
            longitude: alert.longitude,
            latitude: alert.latitude
        });
    }

    update() {
        this.alertService.updateAlert(this.state.id, this.state.name, this.state.message, null, null, null).then((result) => {
            this.props.navigation.navigate('AlertList');
        }).catch((err) => {
            this.setState({error: err});
        });
    }

    render() {
        const params = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>Details Screen</Text>
                {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}
                <Text style={styles.propName}>NAME:</Text>
                <TextInput
                    name="name"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoCorrect={false}
                    value={this.state.name}
                    style={styles.input}
                    onChangeText={(name) => this.setState({ name })}
                />
                <Text style={styles.propName}>MESSAGE:</Text>
                <TextInput
                    name="name"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoCorrect={false}
                    value={this.state.message}
                    style={styles.input}
                    onChangeText={(message) => this.setState({ message })}
                />
                <Text style={styles.propName}>LATITUDE:</Text>
                <Text style={styles.details}>{this.state.latitude}</Text>
                <Text style={styles.propName}>LONGITUDE:</Text>
                <Text style={styles.details}>{this.state.longitude}</Text>
                { params.name !== this.state.name || params.message !== this.state.message ?
                    <Button
                        title="Update"
                        onPress={this.update}
                    /> 
                    : null
                }
                <Button
                    title="Go back"
                    onPress={() => this.props.navigation.navigate('AlertList')}
                />
            </View>
        );
    }
}
const ELEMENT_WIDTH = width - 80;
const styles = StyleSheet.create({
    container: {
        flex: 1, 
    },
    mainText: {
        fontSize: 40,
        paddingBottom: 10
    },
    propName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    input: {
        width: ELEMENT_WIDTH,
        fontSize: 20,
        height: 40,
    },
    details: {
        fontSize: 20,
        paddingBottom: 10,
        paddingTop: 10
    },
    error: {
        color: 'red',
        paddingBottom: 10,
        fontWeight: 'bold'
    }
});
