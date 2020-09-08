module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'temperatures-inputs',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 4,
                function:'input-registers'
            },
            {
                id: 'digital-inputs-state',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 4,
                advanced:{
                    get:{
                        function:'discrete-inputs'
                    },
                    set: null
                }
            },
            {
                id: 'digital-outputs-state',
                type: 'modbus',

                'address'  : 0,
                'quantity' : 4,
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
            ...[...Array(4).keys()].map((shift) => {
                return [
                    `temperature-${shift+1}`,
                    {
                        transportId :'temperatures-inputs',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift,
                            quantity:4,
                            precision:1,
                            divider:10,
                            min:0,
                            max:200
                        },
                    }
                ]
            }),
            ...[...Array(4).keys()].map((shift) => {
                return [
                    `digital-input-${shift+1}`,
                    {
                        transportId :'digital-inputs-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'booleanToBooleanArray',
                            shift,
                            quantity:4
                        },
                    }
                ]
            }),
            ...[...Array(4).keys()].map((shift) => {
                return [
                    `digital-output-${shift+1}`,
                    {
                        transportId :'digital-outputs-state',
                        //bridge
                        dataTypeBridge      : {
                            type:'booleanToBooleanArray',
                            shift,
                            quantity:4
                        },
                    }
                ]
            })
        ])
    },
    name : `Temperature module MB4RTD`,
    sensors   : [
        ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `temperature-${shift+1}`,
                'unit'     : '°C',
                'retained' : true,
                'settable' : false,
                'name'     : `Temperature-${shift+1}`,
            }
        }),
        ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `digital-input-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : false,
                'name'     : `Digital input ${shift+1}`
            }
        }),
        ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `digital-output-${shift+1}`,
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
