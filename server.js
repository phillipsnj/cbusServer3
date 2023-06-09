const cbusServer = require('./cbusServer')
const canUSB = require('./canUSB')
const {SerialPort} = require("serialport")
const jsonfile = require('jsonfile')

const NET_PORT = 5550
const NET_ADDRESS = "localhost"

const os = require('os');
const networkInterfaces = os.networkInterfaces();
const ip = networkInterfaces['en0'][1].address

console.log(`IP : ${ip}`)

// use command line to suppress starting cbusServer, so network port can be used
// command line arguments will be 'node' <javascript file started> '--' <arguments starting at index 3>
if ( process.argv[3] != 'network') {
    cbusServer.cbusServer(NET_PORT)
    console.log('\nStarting cbusServer...\n');
} else { console.log('\nUsing network...\n'); }

SerialPort.list().then(ports => {

    ports.forEach(function(port) {
        if (port.vendorId != undefined && port.vendorId.toString().toUpperCase() == '04D8' && port.productId.toString().toUpperCase() == 'F80C') {
            canUSB.canUSB(port.path, NET_PORT, NET_ADDRESS)
        }
    })
})
