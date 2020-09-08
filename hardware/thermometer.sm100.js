module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        mapping : {
            'temperature' : {
                transport  : {
                    type: 'modbus',

                    'function' : 'input-registers',
                    'address'  : 30004,
                    'quantity' : 1
                },
                //bridge
                dataTypeBridge      : {
                    type:'floatToRegisterArray',
                    precision:2,
                    divider:100
                }
            }
        }
    },
    name : 'Thermometer SM-100',
    sensors   : [
        {
            'id'       : 'temperature',
            'unit'     : '°C',
            'retained' : true,
            'settable' : false,
            'name'     : 'Temperature'
        },
    ],
    options   : [],
    telemetry : []
};
