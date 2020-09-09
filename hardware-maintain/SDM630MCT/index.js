async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}
module.exports = {
    name: 'SDM630MCT',
    description: 'Eastron SDM630MCT Smart Meter',
    vendor: 'Eastron',
    tags: 'SDM630MCT, Eastron, Meter',
    set_slave_id
}

