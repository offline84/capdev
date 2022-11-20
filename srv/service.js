const sequenceHelperForVehicles = require("./Helpers/sequenceHelperForVehicles");
const cds = require('@sap/cds');

module.exports = (srv) => {

    //Here we auto generate an ID and do some checks on 
    srv.before("CREATE", 'Vehicles', async (req) => {
        req.data.ID = await sequenceHelperForVehicles.getNewID("SEQ_VEHICLE");

        if (req.data.VIN_NUMBER == "") {
            req.reject(400, "VIN_NUMBER is required");
        }

        let query = SELECT`VIN_NUMBER`.from`Vehicles`.where`VIN_NUMBER = ${req.data.VIN_NUMBER}`;
        let vinInDb = await srv.run(query);
            if(vinInDb.length > 0) {
                req.reject(400, "VIN_NUMBER is known in database, only vehicles can be added if vin number is unique");
            }

        if (req.data.MODEL == "") {
            req.reject(400, "MODEL is required");
        }
        if (req.data.BRAND == "") {
            req.reject(400, "BRAND is required");
        }
    });
}