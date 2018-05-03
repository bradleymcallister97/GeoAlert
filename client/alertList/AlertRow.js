import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class AlertRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <View>
                <Text style={styles.mainText}>{this.props.alert.name}</Text>
                <Text style={styles.smallText}>{this.props.alert.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainText: {
        fontSize: 20
    },
    smallText: {
        fontSize: 12,
        color: '#8e9496',
    }
});
