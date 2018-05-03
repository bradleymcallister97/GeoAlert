import React from 'react';
import { TextInput, Text, View, StyleSheet, Dimensions, Button } from 'react-native';
const { width } = Dimensions.get('window');
import Auth from '../services/auth.service';

export default class CreateAccount extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: null
        };

        this.auth = new Auth();
        
        this.createAccount = this.createAccount.bind(this);
    }

    createAccount() {
        const {username, password} = this.state;
        if (username && password) {
            this.auth.register(username, password).then((user) => {
                return this.auth.login(username, password);
            }).then((token) => {
                this.props.navigation.navigate('AlertList');
            }).catch((error) => {
                this.setState({
                    error: error.message
                });
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>Create Account</Text>
                {this.state.error ? <Text style={styles.error}>Error: {this.state.error}</Text> : null}                
                <TextInput
                    name="username"
                    placeholder="Username"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={this.state.username}
                    style={styles.input}
                    onChangeText={(username) => this.setState({ username })}
                />
                <TextInput
                    name="password"
                    placeholder="Password"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoCorrect={false}
                    keyboardType="email-address"
                    value={this.state.password}
                    style={styles.input}
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button
                    onPress={this.createAccount}
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
    error: {
        color: 'red'
    }
});
