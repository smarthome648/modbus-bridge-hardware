module.exports = {
    //id from env.DEVICE_NODES
    //hardware from env.DEVICE_NODES
    //slaveId from env.DEVICE_NODES
    extensions : {
    //on this device one read cannot exceed 60 regs
        transports: [
            {
                id: 'v-c-ap-fp-rp-pf',
                type: 'modbus',

                'function' : 'input-registers',
                'address'  : 0,
                'quantity' : 36
            },
                        {
                id: 'altn-alc-solc-tsp-tspf-tspa-freq-tikwh-tekvh',
                type: 'modbus',

                'function' : 'input-registers',
                'address'  : 42,
                'quantity' : 34
            },

        ],
        mapping : Object.fromEntries([
        //Volts (line to neutral) 
        ...[...Array(3).keys()].map((shift) => {
                return [
                    `v-${shift+1}`,
                    {
                        transportId :'v-c-ap-fp-rp-pf',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 0 + shift*2,
			precision:1,
					
                   	 }
                    }
                ]
            }),
         //Volts Average
         ...[...Array(1).keys()].map((shift) => {
                return [
                    `av-${shift+1}`,
                    {
                        transportId :'altn-alc-solc-tsp-tspf-tspa-freq-tikwh-tekvh',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 0 + shift*2,
			precision:1,
					
                   	 }
                    }
                ]
            }),
         //Current
        ...[...Array(3).keys()].map((shift) => {
                return [
                    `c-${shift+1}`,
                    {
                        transportId :'v-c-ap-fp-rp-pf',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 6 + shift*2,
			precision:1,
					
                   	 }
                    }
                ]
            }),
         //Current Average
         ...[...Array(1).keys()].map((shift) => {
                return [
                    `ac-${shift+1}`,
                    {
                        transportId :'altn-alc-solc-tsp-tspf-tspa-freq-tikwh-tekvh',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 4 + shift*2,
			precision:1,
					
                   	 }
                    }
                ]
            }),
         //Current summ
         ...[...Array(1).keys()].map((shift) => {
                return [
                    `sc-${shift+1}`,
                    {
                        transportId :'altn-alc-solc-tsp-tspf-tspa-freq-tikwh-tekvh',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 6 + shift*2,
			precision:1,
					
                   	 }
                    }
                ]
            }),
        //Active power
        ...[...Array(3).keys()].map((shift) => {
                return [
                    `ap-${shift+1}`,
                    {
                        transportId :'v-c-ap-fp-rp-pf',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 12 + shift*2,
			precision:0,
					
                   	 }
                    }
                ]
            }),
         //Active powwer summ
         ...[...Array(1).keys()].map((shift) => {
                return [
                    `sp-${shift+1}`,
                    {
                        transportId :'altn-alc-solc-tsp-tspf-tspa-freq-tikwh-tekvh',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 10 + shift*2,
			precision:0,
					
                   	 }
                    }
                ]
            }),
        //Power factor
        ...[...Array(3).keys()].map((shift) => {
                return [
                    `pf-${shift+1}`,
                    {
                        transportId :'v-c-ap-fp-rp-pf',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 30 + shift*2,
			precision:3,
					
                   	 }
                    }
                ]
            }),
         //Frequency
         ...[...Array(1).keys()].map((shift) => {
                return [
                    `freq-${shift+1}`,
                    {
                        transportId :'altn-alc-solc-tsp-tspf-tspa-freq-tikwh-tekvh',
                         //bridge
                        dataTypeBridge      : {

			type:'standardFloat',
			endian:'big',				
			shift : 28 + shift*2,
			precision:2,
					
                   	 }
                    }
                ]
            }),
            
        ]),
        
    },
    name : 'SDM630MCT',
    sensors   : [
    //Volts
       ...[...Array(3).keys()].map((shift) => {
            return {
                'id'       : `v-${shift+1}`,
                'unit'     : 'V',
                'retained' : true,
                'settable' : false,
                'name'     : `V${shift+1}`
            }
        }),
    //Average volts
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `av-${shift+1}`,
                'unit'     : 'V',
                'retained' : true,
                'settable' : false,
                'name'     : `V Average`
            }
        }),
     //current
       ...[...Array(3).keys()].map((shift) => {
            return {
                'id'       : `c-${shift+1}`,
                'unit'     : 'A',
                'retained' : true,
                'settable' : false,
                'name'     : `I${shift+1}`
            }
        }),
      //current average
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `ac-${shift+1}`,
                'unit'     : 'A',
                'retained' : true,
                'settable' : false,
                'name'     : `I Average`
            }
        }),
     //summ current
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `sc-${shift+1}`,
                'unit'     : 'A',
                'retained' : true,
                'settable' : false,
                'name'     : `I Summ`
            }
        }),
     //active power
       ...[...Array(3).keys()].map((shift) => {
            return {
                'id'       : `ap-${shift+1}`,
                'unit'     : 'W',
                'retained' : true,
                'settable' : false,
                'name'     : `P${shift+1} Active`
            }
        }),
      //Full Power
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `sp-${shift+1}`,
                'unit'     : 'W',
                'retained' : true,
                'settable' : false,
                'name'     : `P Active Summ`
            }
        }),
      //Power Factor
       ...[...Array(3).keys()].map((shift) => {
            return {
                'id'       : `pf-${shift+1}`,
                'unit'     : '',
                'retained' : true,
                'settable' : false,
                'name'     : `Power factor ${shift+1}`
            }
        }),
	//frequency
       ...[...Array(1).keys()].map((shift) => {
            return {
                'id'       : `freq-${shift+1}`,
                'unit'     : 'Hz',
                'retained' : true,
                'settable' : false,
                'name'     : `Frequency`
            }
        }),

    ],
    options   : [],
    telemetry : []
};
