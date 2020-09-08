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
                'quantity' : 2,
                advanced:{
                    get:{
                        function:'coils'
                    },
                    set:{
                        function:'discrete-inputs'
                    }
                }
            },
            {
                id: 'digital-inputs-state',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 2,
                advanced:{
                    get:{
                        function:'discrete-inputs'
                    },
                    set: null
                }
            }
        ],
        mapping : Object.fromEntries([
            ...[...Array(2).keys()].map((shift) => {
                return [
                    `relay-${shift+1}`,
                    {
                        transportId :'relay-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'booleanToBooleanArray',
                            shift,
                            quantity:2
                        },
                    }
                ]
            }),
            ...[...Array(2).keys()].map((shift) => {
                return [
                    `digital-input-${shift+1}`,
                    {
                        transportId :'digital-inputs-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'booleanToBooleanArray',
                            shift,
                            quantity:2
                        },
                    }
                ]
            })
        ])
    },
    name : `Relay MB2DI2RO`,
    sensors   : [
        ...[...Array(2).keys()].map((shift) => {
            return {
                'id'       : `relay-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : true,
                'name'     : `Relay ${shift+1}`
            }
        }),
        ...[...Array(2).keys()].map((shift) => {
            return {
                'id'       : `digital-input-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : false,
                'name'     : `Digital input ${shift+1}`
            }
        })
    ],
    options   : [],
    telemetry : []
};
