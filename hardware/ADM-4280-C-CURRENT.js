module.exports = {
    extensions : {
        transports: [
            {
                id: 'analog',
                type: 'modbus',

                'function' : 'input-registers',
                'address'  : 0,
                'quantity' : 8
            },
        ],
        mapping : Object.fromEntries([
        ...[...Array(8).keys()].map((shift) => {
                return [
                    `a-${shift+1}`,
{
                        transportId :'analog',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift,
                            quantity:8,
                            precision:3,
                            divider:1000
                        }
                    }
                ]
            })

        ])
        
    },
    name : 'ADM-4280-C-CURRENT',
    sensors   : [
       ...[...Array(8).keys()].map((shift) => {
            return {
                'id'       : `a-${shift+1}`,
                'unit'     : 'A',
                'retained' : true,
                'settable' : false,
                'name'     : `I${shift+1}`
            }
        }),

    ],
    options   : [],
    telemetry : []
};
