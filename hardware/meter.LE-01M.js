module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'meter-registers',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 3,
                function:'holding-registers'
            }
        ],
        mapping : {
            'kwh' : {
                transportId :'meter-registers',
                //bridge
                dataTypeBridge      : {
                    type:'floatToRegisterArray',
                    precision:2,
                    registersQuantity: 3
                }
            }
        }
    },
    name : `Meter LE-01M`,
    sensors   : [
        {
            'id'       : `kwh`,
            'unit'     : 'kWh',
            'retained' : true,
            'settable' : false,
            'name'     : `value`,
        }
    ],
    options   : [],
    telemetry : []
};
