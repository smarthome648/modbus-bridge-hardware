module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'all',
                type: 'modbus',

                'function' : 'holding-registers',
                'address'  : 4357,
                'quantity' : 24,
            }
        ],
        mapping : Object.fromEntries([
        //Voltage 
        ...[...Array(3).keys()].map((shift) => {
                return [
                    `voltage-${shift}`,
                    {                  
                        transportId :'all',
                        dataTypeBridge      : {
							type:'floatToRegisterArray',
							endian:'big',
							divider:100,				
							shift : 0 + shift,
							signed: false,
							precision:2,					
						}
                    }
                ]
            }),
        //Current 
        ...[...Array(3).keys()].map((shift) => {
                return [
                    `current-${shift}`,
                    {                  
                        transportId :'all',
		        dataTypeBridge      : {
						type: 'layerReverseRegisters',
		       				 shift : 3 + shift*2,
						quantity: 2,
						dataTypeBridge: {
						    type: 'layerRegistersAndBitMask',
						    mask: [[0x00, 0x3F],[0xFF, 0xFF]], // ignoring direction bits. not fully documentet which
						    shift : 3 + shift*2,
						    dataTypeBridge: {
							type: 'layerFloat',
							divider: 1000,
							precision: 3,
							dataTypeBridge: {
							    type: 'standardInt32',
							    shift : 3 + shift*2,
							}
						    }
						
				 }
		        }
                    }
                ]
            }),

		//Active power
        ...[...Array(4).keys()].map((shift) => {
                return [
                    `activepower-${shift}`,
{                  
                        transportId :'all',
		        dataTypeBridge      : {
						type: 'layerReverseRegisters',
		       				 shift : 9 + shift*2,
						quantity: 2,
						dataTypeBridge: {
						    type: 'layerRegistersAndBitMask',
						    mask: [[0x00, 0x3F],[0xFF, 0xFF]], // 7 and 6 bits in most word are for direcion, ignoring. Maybe just 7th bit, not fully documented
						    shift : 9 + shift*2,
						    dataTypeBridge: {
							type: 'layerFloat',
							divider: 100,
							precision: 2,
							dataTypeBridge: {
							    type: 'standardInt32',
							    shift : 9 + shift*2,
							}
						    }
						
				 }
		        }
                    }
                ]
            }),
 

 		//frequency
        ...[...Array(1).keys()].map((shift) => {
                return [
                    `frequency-${shift}`,
                    {                  
                        transportId :'all',
                        dataTypeBridge      : {
							type:'floatToRegisterArray',
							endian:'big',
							divider:100,				
							shift : 17 + shift,
							signed: false,
							precision:2,					
						}
                    }
                ]
            }),
 		//cos(phy)
        ...[...Array(4).keys()].map((shift) => {
                return [
                    `cos-${shift}`,
                    {                  
                        transportId :'all',
                        dataTypeBridge      : {
							type:'floatToRegisterArray',
							endian:'big',
							divider:1000,				
							shift : 18 + shift,
							signed: false,
							precision:3,					
						}
                    }
                ]
            }),
		//Energy summ from reset
        ...[...Array(1).keys()].map((shift) => {
                return [
                    `energysumm-${shift}`,
                    {                  
                        transportId :'all',
                      		        dataTypeBridge      : {
						type: 'layerReverseRegisters',
		       				 shift : 22 + shift*2,
						quantity: 2,
						
						    dataTypeBridge: {
							type: 'layerFloat',
							divider: 1000,
							precision: 3,
							dataTypeBridge: {
							    type: 'standardInt32',
							    shift : 22 + shift*2,
							}
						    
						
				 }
		        }
                    }
                ]
            }),
        ]),
        
    },
    name : 'Mercury 230 via modbus adapter',
    sensors   : [
    //Voltage
       ...[...Array(3).keys()].map((shift) => {
            return {
                'id'       : `voltage-${shift}`,
                'unit'     : 'V',
                'retained' : true,
                'settable' : false,
                'name'     : `Voltage ${(['A','B','C'])[shift]}`
            }
        }),	
	//Current
       ...[...Array(3).keys()].map((shift) => {
            return {
                'id'       : `current-${shift}`,
                'unit'     : 'A',
                'retained' : true,
                'settable' : false,
                'name'     : `Current ${(['A','B','C'])[shift]}`
            }
        }),

    //Active power
        ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `activepower-${shift}`,
                'unit'     : 'W',
                'retained' : true,
                'settable' : false,
                'name'     : `Power ${(['Summ','A','B','C'])[shift]}`
            }
        }),

	//Cos phy
       ...[...Array(4).keys()].map((shift) => {
            return {
                'id'       : `cos-${shift}`,
                'unit'     : '',
                'retained' : true,
                'settable' : false,
                'name'     : `cos(φ) ${(['Summ','A','B','C'])[shift]}`
            }
        }),
 	//frequency
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `frequency-${shift}`,
                'unit'     : 'Hz',
                'retained' : true,
                'settable' : false,
                'name'     : `Frequency`
            }
        }),
	//Summ energy
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `energysumm-${shift}`,
                'unit'     : 'kW*h',
                'retained' : true,
                'settable' : false,
                'name'     : `Energy`
            }
        }),
    ],
    options   : [],
    telemetry : []
};
