# Modbus bridge hardware configurations

# Cli instruments

## Help
`npm run help`
## Start
`npm run start -- <options list>`

Supported options
- `host` - modbus server host. Required.
- `port` - modbus server port. Default value: 502
- `slave-id` - slave id of modbus device. Defailt value: 1
- `hardware` - name of hardware you are going to start. Required.
- `container-name` - docker container name. Default value: `modbus-hardware-develop`
- `device-id` - 2Smart device id. Default value: "modbus-hardware-develop"
- `device-name` - 2Smart device name. Default value: "!Modbus hardware develop"
- `mqtt-user` - mqtt username. See `MQTT_USER` `.env` file in 2Smart root directory.
- `mqtt-pass` - mqtt password. See `MQTT_PASS` `.env` file in 2Smart root directory.
- `mqtt-uri` - mqtt uri for connection. Default value: `mqtt://2smart-emqx`.
- `watch` - true/false. If set `true` bridge will automatically restart after changes in hardware folder. Default value: `true`.
- `restart-delay` - number, time in ms. Bridge will automatically restart after fatal errors within that time.
If set `0` no restarts after fatal errors. Default value: `5000`(ms). Minimum 2000.

If `mqtt-pass` isn't provided, then mqtt connection options will be loaded from running 2Smart containers.

For simplicity using command line interface default option values can be set via environment variables(`CONTAINER_NAME`, `HOST`, `PORT`, `MQTT_USER`, `MQTT_PASS`, `MQTT_URI`, `DEVICE_ID`, `DEVICE_NAME`) or .env file(see .env.sample `cp .env.sample .env`).

Press Ctrl+C to finish process

## List devices
`npm run list`

List all supported devices

## Scan
`npm run list -- <options list>`

Scan modbus line for a slave id. Its expected that you have only one device connected to the line.

## Set slave id
`npm run set-slave-id -- <options list>`

Change slave id of the hardware. Not all devices are supported, on some device user have to manually set slave id(i.e. not programmatically).
Some devices don't support change of slave id(maybe support but not documented).

# Folder structure
## [hardware-docs](./hardware-docs)

Contains original device documantation or any documnation what was used in order to write configs. It can be pdf, images, word file, html pages, etc. This will help us and outside contributors to fix bugs and make an improvements.

Subfolders are named with respect to correspoding subfolder in [hardware](./hardware).

## [hardware](./hardware)

Contains hardware configs for modbus bridge. Here is defined how bridge interact with device.

See [Bridge configs format](#bridge-configs-format)

## [hardware-maintain](./hardware-maintain)

Contains accompanying hardware configs. Here is defined any accompanying information and features
that should not be in hardware. It can be functions that change slave id, device description, related tags, etc.
I.e. anything that helps to maintain devices.

Subfolders are named with respect to correspoding subfolder in [hardware](./hardware).

See [Hardware maintain configs format](#hardware-maintain-configs-format)

# Bridge configs format
Examples can be found in [hardware](./hardware).

File format can be either
- json file
- js file exporting the same json
- js file exporting function. The function returns the json depends on input parameters.
This case is well used when input paramenters define number of inputs or outputs.
For example [device](./hardware/ModbusRTU.Relay.RS485RB) are the relay boards with very similar functions,
but number of output relays varies. But still there should be list of supported variations.

## Json file
Example
```
{
  "extensions":{
    "transports":[
      {
        "id":"inputs",
        "address":512,
        "quantity":3,
        "function":"input-registers"
      }
    ],
    "mapping":{
      "temperature":{
        "transportId":"inputs",
        "dataTypeBridge":{
          "type":"floatToRegisterArray",
          "shift":0,
          "quantity":3,
          "precision":1,
          "divider":10
        }
      },
      "humidity":{
        "transportId":"inputs",
        "dataTypeBridge":{
          "type":"floatToRegisterArray",
          "shift":1,
          "quantity":3,
          "precision":1,
          "divider":10
        }
      }
    }
  },
  "name":"Thermometer YDTH-06",
  "sensors":[
    {
      "id":"temperature",
      "unit":"°C",
      "retained":true,
      "settable":false,
      "name":"Temperature"
    },
    {
      "id":"humidity",
      "unit":"%",
      "retained":true,
      "settable":false,
      "name":"Humidity"
    }
  ],
  "options":[],
  "telemetry":[]
}
```

## Js file
Example
```
module.exports = {
  "extensions":{
    ...
  },
  "name":"Thermometer YDTH-06",
  ...
};
```

## Js file exporting function
Example
```
module.exports = function (n) {
    n = parseInt(n);
    return {
        extensions : {
            transports: [
                {
                    id: 'relay-state',

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

```

## Homie iot part

2Smart heavily use [homie mqtt convention](https://homieiot.github.io/specification/) and next fields are
inspired and directly used according to the convention. 

 - `name`      - String. Required. Visible 2Smart node name.
 - `sensors`   - Array of objects. node sensors. 
 - `options`   - Array of objects. node options.
 - `telemetry` - Array of objects. node telemetry.

`sensor`, `option`, `telemetry` object - or more generally named `property`, have the same format:
- `id`       - property id. Id can be repeated in different groups(i.e. in `sensors`, `options`, `telemetry`).
- `unit`     - String. default `''`. See [homie mqtt specification](https://homieiot.github.io/specification/) for recommended unit strings.
- `retained` - Booelan. default `true`.
- `settable` - Booelan. efault `false`.
- `name`     - String. Required. Property name.
- `dataType` - String. One of `integer`, `string`, `float`, `enum`, `boolean`, `color`. Can be inheret from transport.
- `format`   - String. Specify additional dataType info. See [homie mqtt specification](https://homieiot.github.io/specification/).

*We recommend:
- add to `sensors` array properties that are main for the hardware.
- add to `options` array properties that changes somehow device functions.
- add to `telemetry` array properties like battary level, signal level, etc.


## "Extensions" part

### Extensions.Transport
Responsible for sendind particular data to source(modbus line) and receiving data comming from line.


- `id` - transport id. Need for mapping transport to property
- `address` - address of starting register/bit
- `quantity` - how many bits/registers
- `function` - `input-registers`, `holding-registers`, `coils` or `discrete-inputs`

*We recommend to reduce number of messages to modbus line and
use one transport operating with multiple registers,
than multiple transaports for every register.

### Extensions.mapping
Defines connection between properties and transport, as well,
as type converting rules. `extensions.mapping` is object, with keys - sensors ids,
or `$options/<option-id>`, `$telemetry/<telemetry-id>` in case of options and telemetry. And values
are very straightforward understable from example.

### DataTypeBridge
Defines convertion from and to modbus register/bit formats.


# Hardware maintain configs format
Its file exporting js-object with `description`, `name`, `tags` list, `set_slave_id` function.
- `name` - device name
- `description` - shot explanation of hardware functions
- `tags` - comma separated string with list of tags, like company vendor name, device class(thermometer, relay, electricity-meter) etc
- `set_slave_id` - function that defines the way(promatically or via instructions) how user can change device slave id. If its not defined, not docummented, or just not realized, function should log that operation cannot be done and reason

# Contributing

The main goal of this repository is to allow anyone to add modbus devices to 2smart project. We are grateful to the community for contributing bugfixes and improvements. PLease, read below to learn how you can take part in the project.

## [Code of Conduct](./CODE_OF_CONDUCT.md)

We have adopted a Code of Conduct that we expect project participants to adhere to. Please read [code of conduct](./CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## [Contributing Guide](./CONTRIBUTING.md)

Read our [contributing guide](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

## License

The project is [GNU GENERAL PUBLIC v3 licensed](./LICENSE).
