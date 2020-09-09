async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}
module.exports = {
    name: 'Temperature module PD3060',
    description: '6-channel reader for PT100 temperature sensors, RS-485 connection',
    vendor: null,
    tags: 'PD3060-PT100, Temperature module, temperature sensors, PT100, 6-channel reader',
    set_slave_id
}

