module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
        transports: [
            {
                id: 'v-m-q3-gv-gm-w3-t-p',
                type: 'modbus',

                'function' : 'input-registers',
                'address'  : 58,
                'quantity' : 86
            },
            {
                id: 'q1-w1-ts1',
                type: 'modbus',

                'function' : 'input-registers',
                'address'  : 216,
                'quantity' : 65
            }
        ],
        mapping : Object.fromEntries([
        //Energy 
        ...[...Array(1).keys()].map((shift) => {
                return [
                    `energ-${shift+1}`,
                    {
                        transportId :'q1-w1-ts1',
                         //bridge
                        dataTypeBridge      : {
                        	type: 'sumFloat',
				precision:3,
		                dataTypesBridge      :[
				{
					type:'standardInt32',
					endian:'big',				
					shift : 0 + shift*4,
					precision:2,
				},
				{
					type:'standardFloat',
					endian:'big',				
					shift : 0 + shift*4+2,
					precision:20,
				},
				]		
                   	 }
                    }
                ]
            }),
        //Thermal power 
        ...[...Array(1).keys()].map((shift) => {
                return [
                    `thpow-${shift+1}`,
                    {
                        transportId :'q1-w1-ts1',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 40 + shift*2,
			precision:5,
					
                   	 }
                    }
                ]
            }),

            //Volume
            ...[...Array(1).keys()].map((shift) => {
                return [
                    `vol-${shift+1}`,
                    {
                        transportId :'v-m-q3-gv-gm-w3-t-p',
				
                        //bridge
                        dataTypeBridge      : {
                        	type: 'sumFloat',
				precision:3,
		                dataTypesBridge      :[
				{
					type:'standardInt32',
					endian:'big',				
					shift : 0 + shift*4,
					precision:2,
				},
				{
					type:'standardFloat',
					endian:'big',				
					shift : 0 + shift*4+2,
					precision:20,
				},
				]		
			}
		    }
                ]
            }),
         //rashod 
        ...[...Array(1).keys()].map((shift) => {
                return [
                    `gvol-${shift+1}`,
                    {
                        transportId :'v-m-q3-gv-gm-w3-t-p',
                        //bridge
                        dataTypeBridge      : {
			type:'standardFloat',
			endian:'big',				
			shift : 48 + shift*2,
			precision:4,
                            
                        },
                    }
                ]
            }),
        //Temperatures 
        ...[...Array(2).keys()].map((shift) => {
                return [
                    `temp-${shift+1}`,
                    {
                        transportId :'v-m-q3-gv-gm-w3-t-p',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift: 72 + shift,
                            quantity:2,
                            divider:100,
                            precision:2,
                            signed: true
                        },
                    }
                ]
            }),
        //Dt 
        ...[...Array(1).keys()].map((shift) => {
                return [
                    `deltat-${shift+1}`,
                    {
                        transportId :'q1-w1-ts1',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift: 48 + shift,
                            quantity:2,
                            divider:100,
                            precision:2,
                            signed: true
                        },
                    }
                ]
            }),
        //Pressure 
/*         ...[...Array(2).keys()].map((shift) => {
                return [
                    `press-${shift+1}`,
                    {
                        transportId :'v-m-q3-gv-gm-w3-t-p',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift: 78 + shift,
                            quantity:2,
                            divider:10000,
                            signed: false,
                            precision:4
                        },
                    }
                ]
            }), */
         //Dp 
/*         ...[...Array(1).keys()].map((shift) => {
                return [
                    `deltap-${shift+1}`,
                    {
                        transportId :'q1-w1-ts1',
                        //bridge
                        dataTypeBridge      : {
                            type:'floatToRegisterArray',
                            shift: 49 + shift,
                            quantity:4,
                            divider:10000,
                            precision:2,
                            signed: true
                        },
                    }
                ]
            }), */
         //TS tsch, tos
/*             ...[...Array(2).keys()].map((shift) => {
                return [
                    `ts1-t-${shift+1}`,
                    {
                        transportId :'q1-w1-ts1',
                         //bridge
                        dataTypeBridge      : {

			type:'standardInt32',
			endian:'big',				
			shift : 51 + shift*2,
			precision:4,
					
                   	 }
                    }
                ]
            }), */
        ]),
        
    },
    name : 'Heat calculator TVK-01',
    sensors   : [
    //Energy
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `energ-${shift+1}`,
                'unit'     : 'Gcal',
                'retained' : true,
                'settable' : false,
                'name'     : `Q1 Energy`
            }
        }),	
	//Thermal power
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `thpow-${shift+1}`,
                'unit'     : 'Gcal/h',
                'retained' : true,
                'settable' : false,
                'name'     : `W1 Thermal power`
            }
        }),

        //Volumes
        ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `vol-${shift+1}`,
                'unit'     : 'm³',
                'retained' : true,
                'settable' : false,
                'name'     : `V${shift+1}`
            }
        }),

        //Temperatures    
        ...[...Array(2).keys()].map((shift) => {
            return {
                'id'       : `temp-${shift+1}`,
                'unit'     : '°C',
                'retained' : true,
                'settable' : false,
                'name'     : `T${shift+1}`
            }
        }),
		//Consumption   
        ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `gvol-${shift+1}`,
                'unit'     : 'm³/h',
                'retained' : true,
                'settable' : false,
                'name'     : `Gv${shift+1}`
            }
        }),
         //dt    
        ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `deltat-${shift+1}`,
                'unit'     : '°C',
                'retained' : true,
                'settable' : false,
                'name'     : `dT`
            }
        }),     
        //Pressure   
/*         ...[...Array(2).keys()].map((shift) => {
            return {
                'id'       : `press-${shift+1}`,
                'unit'     : 'MPa',
                'retained' : true,
                'settable' : false,
                'name'     : `P${shift+1}`
            }
        }), */
       //dP    
/*         ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `deltap-${shift+1}`,
                'unit'     : 'MPa',
                'retained' : true,
                'settable' : false,
                'name'     : `dP`
            }
        }), */
        //TS1 - tsh tos   
/*         ...[...Array(2).keys()].map((shift) => {
            return {
                'id'       : `ts1-t-${shift+1}`,
                'unit'     : 'min',
                'retained' : true,
                'settable' : false,
                'name'     : `T${(['cnt - thermal energy count time', 'stop - thermal energy count stop time'])[shift]}`
            }
        }), */
    ],
    options   : [],
    telemetry : []
};
