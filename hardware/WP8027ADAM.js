module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'digital-output-state',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 16,
                advanced:{
                    get:{
                        function:'coils'
                    },
                    set:{
                        function:'discrete-inputs'
                    }
                }
            }
        ],
        mapping : Object.fromEntries([
            ...[...Array(16).keys()].map((shift) => {
                return [
                    `relay-${shift+1}`,
                    {
                        transportId :'digital-output-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'booleanToBooleanArray',
                            shift,
                            quantity:16
                        }
                    }
                ]
            })
        ])
    },
    name : 'Digital outputs WP8027ADAM',
    sensors   : [
        ...[...Array(16).keys()].map((shift) => {
            return {
                'id'       : `relay-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : true,
                'name'     : `Digital output ${shift+1}`
            }
        })
    ],
    options   : [],
    telemetry : []
};
