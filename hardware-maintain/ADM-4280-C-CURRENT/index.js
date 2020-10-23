async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'ADM-4280-C-CURRENT',
    description: 'ADM-4280-C-CURRENT',
    vendor: null,
    tags: 'ADM-4280-C, ADM-4280-C-CURRENT',
    set_slave_id
}