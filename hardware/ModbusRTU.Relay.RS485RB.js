module.exports = function (n) {
    n = parseInt(n);
    return {
        //id from env.DEVICE_NODES
        //hardware from env.DEVICE_NODES
        //slaveId from env.DEVICE_NODES
        extensions : {
            transports: [
                {
                    id: 'relay-state',
                    type: 'modbus',

                    'address'  : 0,
                    'quantity' : n,
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
                ...[...Array(n).keys()].map((shift) => {
                    return [
                        `relay-${shift+1}`,
                        {
                            transportId :'relay-state',
                            //bridge
                            dataTypeBridge      : {
                                type:'booleanToBooleanArray',
                                shift,
                                quantity:n
                            }
                        }
                    ]
                })
            ])
        },
        name : `Modbus RTU Relay RS485RB-${n}`,
        sensors   : [
            ...[...Array(n).keys()].map((shift) => {
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
};
