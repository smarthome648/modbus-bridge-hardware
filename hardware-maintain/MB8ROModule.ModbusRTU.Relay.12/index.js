async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'Modbus RTU Relay MB8ROModule 12',
    description: 'Modbus RTU Relay MB8ROModule 12',
    vendor: null,
    tags: 'relay, MB8ROModule 12',
    set_slave_id
}