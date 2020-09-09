async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}

module.exports = {
    name: 'Thermometer YDTH-06',
    description: 'Thermometer YDTH-06',
    vendor: null,
    tags: 'Thermometer, YDTH-06',
    set_slave_id
}
