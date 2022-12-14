const cds = require('@sap/cds');
cds.env.features.kibana_formatter = true;

function writeInfo (id, userName, field, valueBefore, valueAfter, recordId, tableName) {

    const logger = cds.log(id, { label: "UPDATE", level: 'INFO' });

    logger.setFormat((id, ...args) => [
        '[', (new Date).toLocaleString(),
        '|', "INFO     ",
        '|', cds.context?.tenant || '-',
        '|', cds.context?.id || '-',
        '|Table :', tableName,
        '|RowId:', recordId,
        '|', id, '] => ', ...args
    ]);

    logger.info("User ", userName, " changed field ", field, " from ", valueBefore.toLocaleString(), " to " ,
    valueAfter.toLocaleString());
}

function writeError (id, userName, error, recordId, tableName) {

    const logger = cds.log(id, { label: "ERROR", level: 'ERROR' });

    logger.setFormat((id, ...args) => [
        '[', (new Date).toLocaleString(),
        '|', cds.context?.tenant || '-',
        '|', cds.context?.id || '-',
        '|', "ERROR     ",
        '|Table :', tableName,
        '|RowId:', recordId,
        '|', id, " - ", userName, '] => ', ...args
    ]);

    logger.error("User ", userName, " experienced an error when updating record id: ", recordId,
     " in table ", tableName, " => ", error);
}

function writeError (id, userName, error) {

    const logger = cds.log(id, { label: "ERROR", level: 'ERROR' });

    logger.setFormat((id, ...args) => [
        '[', (new Date).toLocaleString(),
        '|', cds.context?.tenant || '-',
        '|', cds.context?.id || '-',
        '|', "ERROR     ",
        '|', id, " - ", userName, '] => ', ...args
    ]);

    logger.error("User ", userName, " experienced an error => ", error.toString());
}

module.exports = {
    writeInfo: writeInfo,
    writeError: writeError
};