import AlertService from '../services/alerts.service'; 
import { sendNotification } from '../services/notification.service';
import * as _ from 'lodash';

export default (lat, long) => {
    const alertService = new AlertService();
    let range = 1;
    let sort = null;
    let limit = 20;

    return Promise.all([
        // get alerts that are active an in range
        alertService.getAlerts(lat, long, range, sort, limit, true, true),
        // get alerts that are inactive and out of range
        alertService.getAlerts(lat, long, range, sort, limit, false, false)
    ]).then(([activatedAlerts, alertsUpdateActivated]) => {
        let promises = [];

        // for all activated in range alerts
        activatedAlerts.forEach(alert => {
            // send notification to user
            sendNotification(alert.name, alert.message);
            // update alert to be inactive
            promises.push(alertService.updateAlert(alert._id, null, null, null, null, false));
        });

        // for all inactive out of range alerts
        alertsUpdateActivated.forEach(alert => {
            // update alert to active
            promises.push(alertService.updateAlert(alert._id, null, null, null, null, true));
        });
        return Promise.all(promises);
    });
}
