module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'voltage-inputs-state',
                type: 'modbus',

                function   :'holding-registers',
                'address'  : 0,
                'quantity' : 8
            }
        ],
        mapping : Object.fromEntries([
            ...[...Array(8).keys()].map((shift) => {
                return [
                    `voltage-input-${shift+1}`,
                    {
                        transportId :'voltage-inputs-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift,
                            quantity:8,
                            divider:4095/10,
                            precision:2
                        }
                    }
                ]
            })
        ])
    },
    name : 'Voltage inputs WP3084ADAM',
    sensors   : [
        ...[...Array(8).keys()].map((shift) => {
            return {
                'id'       : `voltage-input-${shift+1}`,
                'unit'     : 'V',
                'retained' : true,
                'settable' : false,
                'name'     : `Voltage input ${shift+1}`
            }
        })
    ],
    options   : [],
    telemetry : []
};
