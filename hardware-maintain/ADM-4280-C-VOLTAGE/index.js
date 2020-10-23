async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'ADM-4280-C-VOLTAGE',
    description: 'ADM-4280-C-VOLTAGE',
    vendor: null,
    tags: 'ADM-4280-C, ADM-4280-C-VOLTAGE',
    set_slave_id
}