const sequenceHelperForVehicles = require("./Helpers/sequenceHelperForVehicles");

module.exports = (srv) => {

    //Here we auto generate an ID and do some checks on 
    srv.before("CREATE", 'Vehicles', async (req) => {
        req.data.ID = await sequenceHelperForVehicles.getNewID("SEQ_VEHICLE");
        
        
    });
}