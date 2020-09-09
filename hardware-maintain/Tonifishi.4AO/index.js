async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Documented operation not working.');
}
module.exports = {
    name: 'Tonifishi 4AO',
    description: 'Tonifishi 4 analog outputs',
    vendor: 'Tonifishi',
    tags: 'Tonifishi, 4AO',
    set_slave_id
}
