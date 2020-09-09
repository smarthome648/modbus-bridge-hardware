async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}
module.exports = {
    name: 'Thermometr SM-100',
    description: 'Thermometr SM-100',
    vendor: null,
    tags: 'Thermometr, SM-100',
    set_slave_id
}
