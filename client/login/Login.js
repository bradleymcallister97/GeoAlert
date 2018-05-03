import React from 'react';
import { Text, View, TextInput, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import Auth from '../services/auth.service';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: ''
        };

        this.auth = new Auth();

        this.login = this.login.bind(this);
        this.createAccount = this.createAccount.bind(this);
    }

    static navigationOptions = ({ navigation }) => ({
        // remove back button on login screen
        headerLeft: null
    });

    createAccount() {
        this.props.navigation.navigate('CreateAccount');
    }

    login() {
        const { username, password } = this.state;
        if (username && password) {
            this.auth.login(username, password).then((result) => {
                this.props.navigation.navigate('AlertList');
            }).catch((error) => {
                this.setState({
                    error: error
                });
            });
        } else {
            this.setState({
                error: 'Email and Password are required'
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.mainText}>GeoAlert</Text>
                {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}
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
                    value={this.state.password}
                    style={styles.input}
                    onChangeText={(password) => this.setState({ password })}
                    secureTextEntry={true}
                />
                <TouchableOpacity onPress={this.login}>
                    <Text style={styles.login}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.createAccount}>
                    <Text style={styles.creatAccount}>Create Account</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const ELEMENT_WIDTH = width - 80;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText: {
        fontSize: 40,
        paddingBottom: 20
    },
    input: {
        width: ELEMENT_WIDTH,
        fontSize: 20,
        height: 40,
    },
    login: {
        fontSize: 30,
        color: '#0a9b2c',
        paddingBottom: 20,
        paddingTop: 20
    },
    creatAccount: {
        fontSize: 15,
        color: '#3982f9'
    },
    error: {
        color: 'red'
    }
});
