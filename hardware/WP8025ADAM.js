module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'relay-state',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 8,
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
            ...[0,1,2,3,4,5,6,7].map((shift) => {
                return [
                    `relay-${shift+1}`,
                    {
                        transportId :'relay-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'booleanToBooleanArray',
                            shift,
                            quantity:8
                        },
                    }
                ]
            })
        ])
    },
    name : 'Relay WP8025ADAM',
    sensors   : [
        ...[0,1,2,3,4,5,6,7].map((shift) => {
            return {
                'id'       : `relay-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : true,
                'name'     : `Relay ${shift+1}`
            }
        })
    ],
    options   : [],
    telemetry : []
};
