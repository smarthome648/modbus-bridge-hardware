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
    name: 'Thermometr T10S-B',
    description: 'Thermometr T10S-B',
    vendor: null,
    tags: 'Thermometr, T10S-B',
    set_slave_id
}
