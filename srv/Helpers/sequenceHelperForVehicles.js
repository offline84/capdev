const cds = require("@sap/cds");
async function getNewID(sSequence) {
    return (await cds.run("SELECT " + sSequence + ".NEXTVAL as ID FROM DATA_VEHICLE"))[0]
      .ID;
  }
module.exports = {
    getNewID: getNewID
};