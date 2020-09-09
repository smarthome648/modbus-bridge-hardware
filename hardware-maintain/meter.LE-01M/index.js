async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}
module.exports = {
    name: 'Meter LE-01M',
    description: 'Meter LE-01M',
    vendor: null,
    tags: 'Meter, LE-01M',
    set_slave_id
}