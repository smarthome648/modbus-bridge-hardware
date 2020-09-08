module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'inputs',
                type: 'modbus',

                'address'  : 0x0200,
                'quantity' : 3,
                function:'input-registers'
            }
        ],
        mapping : {
            'temperature': {
                transportId :'inputs',
                //bridge
                dataTypeBridge      : {
                    type:'floatToRegisterArray',
                    shift:0,
                    quantity:3,
                    precision:1,
                    divider:10
                }
            },
            'humidity': {
                transportId :'inputs',
                //bridge
                dataTypeBridge      : {
                    type:'floatToRegisterArray',
                    shift:1,
                    quantity:3,
                    precision:1,
                    divider:10
                }
            },
            'dew-point-temperature': {
                transportId :'inputs',
                //bridge
                dataTypeBridge      : {
                    type:'floatToRegisterArray',
                    shift:1,
                    quantity:3,
                    precision:1,
                    divider:10
                }
            }
        }
    },
    name : `Thermometer YDTH-06`,
    sensors   : [
        {
            'id'       : `temperature`,
            'unit'     : '°C',
            'retained' : true,
            'settable' : false,
            'name'     : `Temperature`,
        },
        {
            'id'       : `humidity`,
            'unit'     : '%',
            'retained' : true,
            'settable' : false,
            'name'     : `Humidity`,
        },
        {
            'id'       : 'dew-point-temperature',
            'unit'     : '°C',
            'retained' : true,
            'settable' : false,
            'name'     : `Dew point temperature`,
        }
    ],
    options   : [],
    telemetry : []
};
