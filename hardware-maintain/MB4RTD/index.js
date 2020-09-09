async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'Temperature module MB4RTD',
    description: 'Temperature module MB4RTD',
    vendor: null,
    tags: 'temperature module, MB4RTD, temperature sensors',
    set_slave_id
}