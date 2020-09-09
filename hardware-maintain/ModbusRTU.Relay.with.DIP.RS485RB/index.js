async function set_slave_id({ modbusConnection, currentSlaveId, newSlaveId, params }) {
    throw new Error('Cannot change slave id. Operation not documented.');
}
module.exports = {
    name: 'ModbusRTU Relay with DIP RS485RB',
    description: 'ModbusRTU Relay with DIP RS485RB',
    vendor: null,
    tags: 'Relay, DIP, RS485RB',
    variations : {
        '1' : {
            description : 'ModbusRTU Relay with DIP RS485RB. 1 relay'
        },
        '2' : {
            description : 'ModbusRTU Relay with DIP RS485RB. 2 relay'
        },
        '4' : {
            description : 'ModbusRTU Relay with DIP RS485RB. 4 relay'
        },
        '8' : {
            description : 'ModbusRTU Relay with DIP RS485RB. 8 relay'
        }
    },
    set_slave_id
}

