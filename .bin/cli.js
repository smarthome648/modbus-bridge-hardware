#!/usr/bin/env node
require('dotenv').config();
const YARGS = require('yargs');
const { execSync, exec, spawnSync } = require("child_process");

const Promise = require('bluebird');
const _ = require('underscore');
const path = require('path');
const fs = require('fs-extra');
const cliProgress = require('cli-progress');
require('console.table');


const errorHandler = (error, showStack=false) => {
    console.error('\x1b[31mFatal error: '+'\x1b[0m'+error.message);
    if (true) console.log(error.stack);
    process.exit(1);
};

async function startBridge(yarv){
    let { host, port, hardware,
        "slave-id" : slave_id,
        "container-name" : container_name,
        "device-id" : device_id,
        "device-name" : device_name,
        "mqtt-user" : mqtt_user,
        "mqtt-pass" : mqtt_pass,
        "mqtt-uri" : mqtt_uri,
        watch,
        "restart-delay" : restart_delay }  = yarv;

    let network = null;
    if (!mqtt_user || !mqtt_pass || !mqtt_uri) {
        mqtt_user = execSync(`docker exec 2smart-core env | grep MQTT_USER | cut -d'=' -f2`, {encoding:'utf8'}).trim();
        mqtt_pass = execSync(`docker exec 2smart-core env | grep MQTT_PASS | cut -d'=' -f2`, {encoding:'utf8'}).trim();
        mqtt_uri = execSync(`docker exec 2smart-core env | grep MQTT_URI | cut -d'=' -f2`, {encoding:'utf8'}).trim();
        network = Object.keys(JSON.parse(execSync(`docker inspect 2smart-core -f "{{json .NetworkSettings.Networks }}"`, {encoding:'utf8'}).trim()))[0];
    }
    async function clear() {
        execSync(`docker stop ${container_name} 2>&1 || true`, {encoding:'utf8'});
        execSync(`docker rm ${container_name} 2>&1 || true`, {encoding:'utf8'});
    }

    let cmd = `docker run --name=${JSON.stringify(container_name)} --env MQTT_USER=${JSON.stringify(mqtt_user)} --env MQTT_PASS=${JSON.stringify(mqtt_pass)} --env MQTT_URI=${JSON.stringify(mqtt_uri)} `+
    `--env MODBUS_CONNECTION_IP=${JSON.stringify(host)} --env MODBUS_CONNECTION_PORT=${JSON.stringify(port)} --env DEVICE_ID=${JSON.stringify(device_id)} --env DEVICE_NAME=${JSON.stringify(device_name)}`;

    cmd+=` --env DEVICE_NODES="${slave_id}:${hardware}"`;
    if (network) cmd+=` --network="${network}"`;
    cmd += ` -v ${path.resolve(process.cwd(), 'hardware')}:/etc/config.nodes`;
    if (network) cmd+=` registry.gitlab.webbylab.com/smarthome/modbus-bridge:market`;

    await clear();

    console.log(cmd);
    let proc = null;
    let enabled_restarts = !!restart_delay;
    let need_restart = false;
    let processing = false;
    let restartTimeout = false;
    let running = false;
    restart_delay = Math.max(restart_delay, 2000);
    process.on('SIGINT', async () => {
        enabled_restarts = false;
        console.log("Caught interrupt signal");
        await clear();
        process.exit(0);
    });

    fs.watch(path.resolve(process.cwd(), 'hardware'), () => {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(restart, 500);
    });
    async function restart() {
        need_restart = true;
        if (processing) return;
        clearTimeout(restartTimeout);
        processing = true;
        need_restart = false;
        await stop();
        await start();
        processing = false;
        if (need_restart) {
            clearTimeout(restartTimeout);
            restartTimeout = setTimeout(restart, 500);
        }
    }
    async function stop() {
        if (!proc) return;
        proc.kill();
        if (!running) return;
        await clear();
        await new Promise((resolve) => proc.on('close', resolve));
    }
    async function start() {
        if (running) throw new Error('Process is already running');
        await clear();
        proc = exec(cmd, {encoding:'utf8', cwd: process.cwd()}, (error, stdout, stderr) => {
            console.log('Finished');
            if (enabled_restarts && !processing) {
                clearTimeout(restartTimeout);
                restartTimeout = setTimeout(restart, restart_delay);
            }
        });
        proc.stdout.on('data', message => console.error(message));
        proc.stderr.on('data', message => console.error(message));
        proc.on('message', message => console.error(message));
        proc.on('error', e => console.error(e));
        proc.on('exit', () => {
            running = false;
            console.log('Process exited!');
        });
        proc.on('disconnect', () => console.log('Disconnected!'));
        proc.on('close', () => {
            running = false;
            console.log('Process closed!');
        });
        running = true;
    }
    await restart();
}
async function showSupportedDeviceList (yarv) {
    const data = {};
    let files = fs.readdirSync(path.resolve(__dirname, '../etc/config.nodes'));
    files.forEach(function(filename){
        const { name } = path.parse(filename);
        data[name] = data[name] || {};
        data[name].configFile = true;
    });

    let dir = path.resolve(__dirname, '../docs/nodes');
    files = fs.readdirSync(dir);
    files.forEach(function(filename){
        const curpath = path.join(dir, filename);
        if(!fs.lstatSync(curpath).isDirectory()){
            console.warn(`${curpath} is not directory.`);
            return;
        }
        data[filename] = data[filename] || {};
        data[filename].hasModbusApiFile = fs.existsSync(path.join(curpath, 'modbus_api.md'));
        data[filename].hasSetSlaveIdFile = fs.existsSync(path.join(curpath, 'set_slave_id.md'));
        data[filename].hasHelpersJsFile = fs.existsSync(path.join(curpath, 'helpers.js'));
        let helpers = null;
        try {
            helpers = require(path.join(curpath, 'helpers'));
        } catch (e) {
            if (e.code!=='MODULE_NOT_FOUND') throw e;
        }
        data[filename].helpersFile = !!helpers;
        if(helpers) data[filename] = { ...helpers, ... data[filename]} ;
    });
    const list = [];
    for(let name in data){
        if(!data[name].configFile) console.warn(`\x1b[33mNo config file\x1b[0m for node ${name}.`);
        if(!data[name].hasModbusApiFile) console.warn(`\x1b[33mNo modbus_api.md file\x1b[0m for node ${name}.`);
        if(!data[name].hasSetSlaveIdFile) console.warn(`\x1b[33mNo set_slave_id.md file\x1b[0m for node ${name}.`);
        if(!data[name].hasHelpersJsFile) console.warn(`\x1b[33mNo helpers.js file\x1b[0m for node ${name}.`);
        if (data[name].variations){
            const variations = data[name].variations;
            for (let part in variations){
                list.push({ name: name+'.'+part, description: data[name].description + ' | ' + (variations[part].description||'') });
            }
        } else list.push({name, description: data[name].description});
    }
    console.table(list);
}
async function scanDeviceSlaveId (yarv) {
    let modbusConnectionConfig = {
        type                    : yarv.protocol,
        ip                      : yarv.host,
        port                    : yarv.port,
        reconnect               : false,
        retryConnectionInterval : 0
    };
    const { from, to, timeout } = yarv;
    let checkObj = null;
    if (yarv.hardware){
        let dir = path.resolve(__dirname, '../docs/nodes');
        const arr = yarv.hardware.split('.');
        const params = [];

        while (arr.length) {
            try {
                console.log(`../docs/nodes/${arr.join('.')}/helpers`);
                const helpers = require(path.join(dir, arr.join('.'), 'helpers'));
                console.log('\x1b[32mMODULE_FOUND\x1b[0m');
                checkObj = {...(checkObj||{}),
                    ...helpers.check,
                    ...((params.length && helpers.variations && helpers.variations[params.join('.')] && helpers.variations[params.join('.')].check) || {})
                };
                break;
            } catch (e) {
                if (e.code!=='MODULE_NOT_FOUND') throw e;
                console.log('\x1b[33mMODULE_NOT_FOUND\x1b[0m');
                params.unshift(arr.pop());
            }
            if (checkObj) break;
        }
        if (checkObj === null) throw new Error(`Cannot load node module(${yarv.hardware})`);
    } else {
        checkObj =_.pick(yarv, 'function', 'address');
        if(yarv.function===undefined) throw new Error('function is required.') ;
        if(yarv.address===undefined) throw new Error('address is required.') ;
        if(yarv.function === 'writeSingleCoil') {
            if(yarv.data===undefined) throw new Error('data is required.') ;
            checkObj.value = yarv.data==='1';
        }
        else if(yarv.function === 'writeSingleRegister') {
            if(yarv.data===undefined) throw new Error('data is required.') ;
            checkObj.value = Buffer.from(yarv.data);
        }
        else if(yarv.function === 'writeMultipleCoils') {
            if(yarv.data===undefined) throw new Error('data is required.') ;
            checkObj.values = yarv.data.split('').map((c)=>c==='1');
        }
        else if(yarv.function === 'writeMultipleRegisters') {
            if(yarv.data===undefined) throw new Error('data is required.') ;
            checkObj.values = yarv.data.match(/.{1,4}/g).map((r)=>Buffer.from(r));
        }
        else {
            if(yarv.quantity===undefined) throw new Error('quantity is required.') ;
            checkObj.quantity = yarv.quantity;
        }
    }

    const ModbusConnection = require(path.resolve(__dirname, '../lib/modbus-bridge/modbus_connection'));
    const Deferred = require(path.resolve(__dirname, '../lib/Deferred/Deferred'));

    const modbusConnection = new ModbusConnection({ ...modbusConnectionConfig, debug: null });
    const connectHandler = () => {
        console.log('\x1b[32mConnected\x1b[0m');
    };
    const closeHandler = () => {
        console.log('\x1b[33mConnection closed\x1b[0m');
    };
    modbusConnection.on('connect', connectHandler);
    modbusConnection.on('close', closeHandler);
    modbusConnection.on('error', errorHandler);
    await modbusConnection.connect();
    if (!modbusConnection.connected) errorHandler(Error('Connection is not established'));

    let checkFunc = null;
    if (checkObj.function === 'readCoils'
        || checkObj.function === 'readDiscreteInputs'
        || checkObj.function === 'readHoldingRegisters'
        || checkObj.function === 'readInputRegisters'){
        if(checkObj.address===undefined) errorHandler(new Error('address is not provided.'), true) ;
        if(checkObj.quantity===undefined) errorHandler(new Error('quantity is not provided.'), true) ;
        checkFunc = async (unitId)=>{
            return await modbusConnection[checkObj.function]({..._.pick(checkObj, 'address', 'quantity'), extra: { unitId }});
        }
    }
    else if (checkObj.function==='writeSingleCoil' || checkObj.function==='writeSingleRegister'){
        if(checkObj.address===undefined) errorHandler(new Error('address is not provided.'), true) ;
        if(checkObj.value===undefined) errorHandler(new Error('value is not provided.'), true) ;
        checkFunc = async (unitId)=>{
            return await modbusConnection[checkObj.function]({..._.pick(checkObj, 'address', 'value'), extra: { unitId }});
        }
    }
    else if (checkObj.function==='writeMultipleCoils' || checkObj.function==='writeMultipleRegisters'){
        if(checkObj.address===undefined) errorHandler(new Error('address is not provided.'), true) ;
        if(checkObj.value===undefined) errorHandler(new Error('values is not provided.'), true) ;
        checkFunc = async (unitId)=>{
            return await modbusConnection[checkObj.function]({..._.pick(checkObj, 'address', 'values'), extra: { unitId }});
        }
    }
    else  errorHandler(new Error(`Unsupported function '${checkObj.function}'.`));

    const multibar = new cliProgress.MultiBar({}, cliProgress.Presets.shades_grey);
    const size = to -from +1;
    const btry = multibar.create(size, 0);
    const bresult = multibar.create(size, 0);

    const promises = [];

    let currentSlaveId = from;
    let pendingAmount = 0;
    let finished = false;

    if(timeout<2) console.wwarn(`\x1b[33mTimeout is too low. The result may be wrong.`);
    let intervalTimeout = setInterval(async ()=>{
        const slaveId = currentSlaveId;
        btry.increment();
        currentSlaveId++;
        pendingAmount++;
        promises.push(checkFunc(slaveId).then(() => {
            bresult.increment();
            multibar.stop();
            clearInterval(intervalTimeout);
            finished = true;
            console.log('\x1b[33mSlave id found:\x1b[0m '+slaveId);
            modbusConnection.off('connect', connectHandler);
            modbusConnection.off('close', closeHandler);
            modbusConnection.on('error', ()=>{});
            modbusConnection.off('error', errorHandler);
            modbusConnection.close();
        }, () => {
            bresult.increment();
        }).then(function(){
            pendingAmount--;
            if(finished && pendingAmount===0){
                console.log('\x1b[31mCannot find slaveId.\x1b[0m');
                process.exit(1);
            }
        }));
        if (slaveId>=to) {
            clearInterval(intervalTimeout);
            finished = true;
        }
    }, timeout*1000);
}
async function setDeviceSlaveId (yarv) {
    let modbusConnectionConfig = {
        type                    : yarv.protocol,
        ip                      : yarv.host,
        port                    : yarv.port,
        reconnect               : false,
        retryConnectionInterval : 0
    };
    let set_slave_id = null;
    let dir = path.resolve(__dirname, '../docs/nodes');
    let arr = yarv.hardware.split('.');
    let params = [];
    while (arr.length) {
        try {
            console.log(`../docs/nodes/${arr.join('.')}/helpers`);
            const helpers = require(path.join(dir, arr.join('.'),'helpers'));
            console.log('\x1b[32mMODULE_FOUND\x1b[0m');
            set_slave_id = (params.length && helpers.variations && helpers.variations[params.join('.')] && helpers.variations[params.join('.')].set_slave_id)
                || (helpers.set_slave_id) || null;
            if (!set_slave_id) errorHandler(new Error(`set_slave_id function is not set for hardware ${yarv.hardware}`));
            break;
        } catch (e) {
            if (e.code!=='MODULE_NOT_FOUND') throw e;
            console.log('\x1b[33mMODULE_NOT_FOUND\x1b[0m');
            params.unshift(arr.pop());
        }
    }

    if (!set_slave_id) errorHandler(new Error(`Cannot find helper config for hardware ${yarv.hardware}`));


    const ModbusConnection = require(path.resolve(__dirname, '../lib/modbus-bridge/modbus_connection'));
    const Deferred = require(path.resolve(__dirname, '../lib/Deferred/Deferred'));

    const modbusConnection = new ModbusConnection({ ...modbusConnectionConfig, debug: null });
    const connectHandler = () => {
        console.log('\x1b[32mConnected\x1b[0m');
    };
    const closeHandler = () => {
        console.log('\x1b[33mConnection closed\x1b[0m');
    };
    modbusConnection.on('connect', connectHandler);
    modbusConnection.on('close', closeHandler);
    modbusConnection.on('error', errorHandler);
    await modbusConnection.connect();
    if (!modbusConnection.connected) errorHandler(new Error('Connection is not established'));


    var res = await set_slave_id({modbusConnection, currentSlaveId: yarv['current-slave-id'], newSlaveId: yarv['new-slave-id'], params:params });
    console.log('\x1b[32mOK: \x1b[0m old slave id - '+yarv['current-slave-id']);
    console.log('\x1b[32mOK: \x1b[0m new slave id - '+yarv['new-slave-id']);
    if (res.resetIsRequired) console.log('\x1b[33mPlease, reset the device in order changes to be applied.\x1b[0m');
    else console.log('\x1b[32mReset is not requred.\x1b[0m');

        modbusConnection.off('connect', connectHandler);
    modbusConnection.off('close', closeHandler);
    modbusConnection.on('error', ()=>{});
    modbusConnection.off('error', errorHandler);
    modbusConnection.close();
}


const yargs = YARGS
    .command('help', 'Show help', function (){
        return yargs.showHelp();
    }, showSupportedDeviceList)
    .command('start', 'Start modbus bridge', function (yargs){
        return yargs
            .option('host', {
                description: 'Host or ip address',
                type: 'string',
                default : process.env.HOST || undefined,
                demandOption: true
            })
            .option('port', {
                description: 'Port number',
                type: 'number',
                default : process.env.PORT || 502,
                demandOption: true
            })
            .option('hardware', {
                description: 'Name of hardware to load test function',
                type: 'string',
                default : process.env.HARDWARE || undefined,
                demandOption: true
            })
            .option('slave-id', {
                description: 'Slave id',
                type: 'number',
                default : process.env.SLAVE_ID || 1,
                demandOption: true
            })
            .option('container-name', {
                description: 'Docker container name',
                type: 'string',
                default : process.env.CONTAINER_NAME || 'modbus-hardware-develop',
                demandOption: true
            })
            .option('device-id', {
                description: 'Device id',
                type: 'string',
                default : process.env.DEVICE_ID || 'modbus-hardware-develop',
                demandOption: true
            })
            .option('device-name', {
                description: 'Device name',
                type: 'string',
                default : process.env.DEVICE_NAME || '!Modbus hardware develop',
                demandOption: true
            })
            .option('mqtt-user', {
                description: 'Mqtt username',
                type: 'string',
                default : process.env.MQTT_USER || '2Smart'
            })
            .option('mqtt-pass', {
                description: 'Mqtt password',
                type: 'string',
                default : process.env.MQTT_PASS
            })
            .option('mqtt-pass', {
                description: 'Mqtt password',
                type: 'string',
                default : process.env.MQTT_URL || 'mqtt://2smart-emqx'
            })
            .option('watch', {
                description: 'true/false. If set `true` bridge will automatically restart after changes in hardware folder.',
                type: 'boolean',
                default : (process.env.WATCH) ? (!!JSON.parse(process.env.WATCH)) : true
            })
            .option('restart-delay', {
                description: 'number, time in ms. Bridge will automatically restart after fatal errors within that time. If set `0` no restarts after fatal errors. Default value: `5000`(ms)',
                type: 'number',
                default : (process.env.RESTART_DELAY) ? process.env.RESTART_DELAY : 5000
            }).requiresArg(['host', 'port', 'hardware', 'slave-id', 'container-name', 'container-name', 'device-id', 'device-name', 'watch']);
    }, startBridge)
    .command('scan', 'Scan bus for a slave id', function (yargs){
        return yargs
            .option('protocol', {
                description : 'Protocol to use',
                choices     : ['tcp'],
                type: 'string',
                default : 'tcp',
                implies:['host', 'port']
            })
            .option('host', {
                description: 'Host or ip address',
                type: 'string'
            })
            .option('port', {
                description: 'Port number',
                type: 'number',
                default : 502
            })
            .option('hardware', {
                description: 'Name of hardware to load test function',
                type: 'string'
            })
            .option('function', {
                description: 'Function to exec to test',
                type: 'string',
                choices: ['readCoils', 'readDiscreteInputs', 'readHoldingRegisters', 'readInputRegisters', 'writeSingleCoil', 'writeSingleRegister', 'writeMultipleCoils', 'writeMultipleRegisters'],
                default:'readCoils'
            })
            .option('quantity', {
                description: 'Modbus parameter for read operations. Number of data units to read.',
                type: 'number',
                default:1
            })
            .option('data', {
                description: 'Modbus parameter for write operations. HEX representation of data in case of registers, or string of bits(0 or 1). Length should be 4 characters(i.e. 1 register) if function works with single register, or 1 character if function works with 1 coil.',
                type: 'string'
            })
            .option('address', {
                description: 'Address for modbus operations.',
                type: 'string',
                default:0
            })
            .option('from', {
                description: 'Slave id to start from',
                type: 'number',
                default:0,
            }).requiresArg(['protocol', 'host','port', 'name'])
            .option('to', {
                description: 'Slave id to end with',
                type: 'number',
                default:247,
            })
            .option('timeout', {
                description: 'Timeout(in seconds) between tries',
                type: 'number',
                default:2,
            }).requiresArg(['protocol', 'host','port', 'from', 'to']);
    }, scanDeviceSlaveId)
    .command('set-slave-id', 'Set slave id for a device', function (yargs){
        return yargs
            .option('protocol', {
                description : 'Protocol for to use',
                choices     : ['tcp'],
                type: 'string',
                default : 'tcp',
                implies:['host', 'port'],
                demandOption: true
            })
            .option('host', {
                description: 'Host or ip address',
                type: 'string'
            })
            .option('port', {
                description: 'Port number',
                type: 'number',
                default : 502
            })
            .option('hardware', {
                description: 'Name of current device',
                type: 'string',
                demandOption: true
            })
            .option('current-slave-id', {
                description: 'Current slave id',
                type: 'number',
                demandOption: true
            }).option('new-slave-id', {
                description: 'News slave id',
                type: 'number',
                demandOption: true
            }).requiresArg(['protocol', 'host','port', 'hardware']);
    }, setDeviceSlaveId)
    .demandCommand(1, 'ERROR: missing parametrs. See: -h')
    .help('help')
    .alias('help', 'h')
    .scriptName("npm run").fail(function (msg, err, yargs) {
        if (err) console.error(err);
        else console.error('You should be doing', yargs.help());
        if (msg) {
            console.error('Error occured:')
            console.error(msg)
        }
        process.exit(0)
      })
    .argv;

    const argv = YARGS.argv;