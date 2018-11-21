const sql = require('mssql');
const secrets = require('./secrets.js');

let pool = null;
let i = 30;
// for (let i = 1000; i < 10000; i + 1000) {
//     setTimeout(() => {
//
//         sendBeacon(i, i, 'sfv', 'pc', i / 10)
//             .then(result => console.log(result))
//             .catch(error => console.error(error));
//     }, i);
// }

setInterval(function() {
    sendBeacon(++i, i, 'sfv', 'pc', i + 15)
        .then(result => console.log(result))
        .catch(error => console.error(error));
}, 50);

async function sendBeacon(userId, username, gameName, platformName, minutesAvailable) {
    try {
        const connection = await getConnection();
        const request = await new sql.Request(connection);
        return request.input(`UserId`, sql.VarChar, userId.toString())
            .input(`Username`, sql.NVarChar, username)
            .input(`GameName`, sql.NVarChar, gameName)
            .input(`PlatformName`, sql.NVarChar, platformName)
            .input(`MinutesAvailable`, sql.Int, minutesAvailable)
            .execute(`spBeacon_Insert`);
    } catch (err) {
        console.log(err);
    }
}

function getConnection() {
    const config = secrets;
    if (pool) return pool;
    pool = new Promise(function(resolve, reject) {
        const connection = new sql.ConnectionPool(config, function(err) {
            if (err) {
                pool = null;
                return reject(err);
            }
            return resolve(connection);
        });
    });
    return pool;
}