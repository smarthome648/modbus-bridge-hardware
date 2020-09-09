async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}
module.exports = {
    name: 'Mercury 230 via modbus adapter',
    description: 'Mercury 230 via modbus adapter',
    vendor: null,
    tags: 'Mercury 230, modbus adapter',
    set_slave_id
}