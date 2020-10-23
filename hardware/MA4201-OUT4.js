module.exports = {
    extensions : {
        transports: [
            {
                id: 'analog',
                type: 'modbus',

                
                'address'  : 0,
                'quantity' : 4,
				advanced:{
					get: {
						function : 'holding-registers'
					},
					set:{
						function : 'input-registers'
					}
				}
            },
        ],
        mapping : Object.fromEntries([
        ...[...Array(4).keys()].map((shift) => {
                return [
                    `a-${shift+1}`,
{
                        transportId :'analog',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift,
                            quantity:4,
                            precision:2,
                            divider:100
                        }
                    }
                ]
            })

        ])
        
    },
    name : 'MA4201-OUT4',
    sensors   : [
       ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `a-${shift+1}`,
                'unit'     : 'mA',
                'retained' : true,
                'settable' : true,
                'name'     : `I${shift+1}`
            }
        }),

    ],
    options   : [],
    telemetry : []
};
