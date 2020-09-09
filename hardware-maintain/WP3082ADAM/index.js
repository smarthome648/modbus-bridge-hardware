// eslint-disable-next-line no-unused-vars
async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    newSlaveId = parseInt(newSlaveId, 10);
    const data = { address: 100, value: Buffer.from([ (newSlaveId>>8)&0xFF, (newSlaveId)&0xFF ]), extra: { unitId: currentSlaveId  } };

    console.log('Request');
    console.log(data);
    const response = await modbusConnection.writeSingleRegister(data);

    console.log('Response');
    console.log(response.response);
}

module.exports = {
    name: 'Analog inputs WP3082ADAM',
    description: 'Analog inputs WP3082ADAM',
    vendor: 'WellPro',
    tags: 'WellPro, WP3082ADAM, Analog inputs',
    set_slave_id
}
