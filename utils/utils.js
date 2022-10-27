const moment = require("moment/moment");

const formatMessage = ( username, message ) => {
    return{
        username,
        message,
        time: moment().format('"DD/MM/YYYY - HH:mm"')
    }
};

module.exports = formatMessage;