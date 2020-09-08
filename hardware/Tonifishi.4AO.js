module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            { 
                id: 'state', 
                type: 'modbus',

                'address'  : 7,
                'quantity' : 12,
                advanced: {
                    get:{
                        'function' : 'holding-registers'
                    },
                    set: {
                        'function' : 'input-registers'
                    }
                }
            }
        ],
        mapping : Object.fromEntries([
            ...[...Array(4).keys()].map((shift) => {
                return [
                    `$options/analog-output-mode-${shift+1}`,
                    {
                        transportId :'state',
                        //bridge
                        dataTypeBridge      : {
                            type:'standardInt16',
                            shift
                        }
                    }
                ]
            }),
            ...[...Array(4).keys()].map((shift) => {
                return [
                    `analog-output-${shift+1}`,
                    {
                        transportId :'state',
                        //bridge
                        dataTypeBridge      : {
                            type: 'floatToRegisterArray',
                            shift: shift + 8,
                            divider: 4095/100,
                            precision: 0
                        },
                    }
                ]
            })
        ])
    },
    name : 'Tonifishi 4AO',
    sensors   : [
        ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `analog-output-${shift+1}`,
                'unit'     : '%',
                'retained' : true,
                'settable' : true,
                'name'     : `Analog output ${shift+1}`
            }
        })
    ],
    options   : [
        ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `analog-output-mode-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : true,
                'name'     : `Analog output mode ${shift+1}`
            }
        })
    ],
    telemetry : []
};
