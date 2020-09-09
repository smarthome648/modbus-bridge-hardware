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
    name: 'Voltage inputs WP3084ADAM',
    description: 'Voltage inputs WP3084ADAM',
    vendor: 'WellPro',
    tags: 'WellPro, WP3084ADAM, Voltage inputs',
    set_slave_id
}
