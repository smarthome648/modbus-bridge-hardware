async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'Relay MB2DI2RO',
    description: 'Relay MB2DI2RO',
    vendor: null,
    tags: 'relay, MB2DI2RO',
    set_slave_id
}