var PushNotification = require('react-native-push-notification');

export function sendNotification(title, message) {
    PushNotification.localNotification({
        title: title,
        message: message
    });
}