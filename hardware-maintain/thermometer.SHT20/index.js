// eslint-disable-next-line no-unused-vars
async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    newSlaveId = parseInt(newSlaveId, 10);
    const data = { address: 0x0101, value: Buffer.from([ (newSlaveId>>8)&0xFF, (newSlaveId)&0xFF ]), extra: { unitId: currentSlaveId  } };

    console.log('Request');
    console.log(data);
    const response = await modbusConnection.writeSingleRegister(data);

    console.log('Response');
    console.log(response.response);

    console.log('\x1b[33mPlease, reset the device in order changes to be applied.\x1b[0m');
}
module.exports = {
    name: 'Thermometr SHT20',
    description: 'Thermometr SHT20',
    vendor: null,
    tags: 'Thermometr, SHT20',
    set_slave_id
}

