async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'MA4201-OUT4',
    description: 'MA4201-OUT4',
    vendor: null,
    tags: 'MA4201-OUT4',
    set_slave_id
}