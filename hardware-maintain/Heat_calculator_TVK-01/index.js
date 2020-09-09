async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not implepemted yet.');
}
module.exports = {
    name: 'Heat calculator TVK-01',
    description: 'Heat calculator',
    vendor: null,
    tags: 'heat calculator, heat meter, TVK-01',
    set_slave_id
}