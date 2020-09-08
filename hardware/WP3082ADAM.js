module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'analog-inputs-state',
                type: 'modbus',

                function   :'holding-registers',
                'address'  : 0,
                'quantity' : 8
            }
        ],
        mapping : Object.fromEntries([
            ...[...Array(8).keys()].map((shift) => {
                return [
                    `analog-input-${shift+1}`,
                    {
                        transportId :'analog-inputs-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift,
                            quantity:8,
                            divider:4095/20,
                            precision:2
                        },
                    }
                ]
            })
        ])
    },
    name : 'Analog inputs WP3082ADAM',
    sensors   : [
        ...[...Array(8).keys()].map((shift) => {
            return {
                'id'       : `analog-input-${shift+1}`,
                'unit'     : 'mA',
                'retained' : true,
                'settable' : false,
                'name'     : `Analog input ${shift+1}`
            }
        })
    ],
    options   : [],
    telemetry : []
};
