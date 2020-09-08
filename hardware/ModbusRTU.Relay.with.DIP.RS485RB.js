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

                    'address'  : 1,
                    'quantity' : 4,
                    advanced:{
                        get:{
                            function:'holding-registers'
                        },
                        set:{
                            function:'input-registers'
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
                                type:'booleanToRegisterArray',
                                shift:8+16*shift,
                                quantity:n,
                                commands:{
                                    'true'  : Buffer.from([1,0]),
                                    'false' : Buffer.from([2,0])
                                }
                            }
                        }
                    ]
                })
            ])
        },
        name : `Modbus RTU Relay with DIP RS485RB-${n}`,
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
