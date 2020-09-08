module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'temperatures-inputs',
                type: 'modbus',

                'address'  : 32,
                'quantity' : 6,
                function:'holding-registers'
            }
        ],
        mapping : Object.fromEntries([
            ...[...Array(6).keys()].map((shift) => {
                return [
                    `temperature-${shift+1}`,
                    {
                        transportId :'temperatures-inputs',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift,
                            quantity:6,
                            precision:1,
                            divider:10,
                            min:-99,
                            max:650
                        }
                    }
                ]
            })
        ])
    },
    name : `Temperature module PD3060`,
    sensors   : [
        ...[...Array(6).keys()].map((shift) => {
            return {
                'id'       : `temperature-${shift+1}`,
                'unit'     : '°C',
                'retained' : true,
                'settable' : false,
                'name'     : `Temperature ${shift+1}`,
            }
        })
    ],
    options   : [],
    telemetry : []
};
