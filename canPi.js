let net = require('net');
let can = require('socketcan');

let channel = can.createRawChannel("can0", true);
//let header = ':SBFA0N'; //This is a standard header for a software node

let NET_PORT = 5550;
let NET_ADDRESS = "localhost";

let pr1 = 2;
let pr2 = 3;
let canId = 0;
let outHeader = (((pr1*4)+pr2)*128)+canId;

let client = new net.Socket();

// Log any message
channel.addListener("onMessage", function(msg) {
    let output=msg.data.toString('hex').toUpperCase();
    let header = msg.id << 5;
    client.write(':S'+header.toString(16).toUpperCase()+'N'+output+';');
} );

client.connect(NET_PORT, NET_ADDRESS, function () {
    console.log('Client Connected');
});

client.on('data', function (data) {
//    data = data.toString();
    let datastr = data.toString().substr(7,data.toString().length-7);
    console.log('canPi: ' + datastr);
    console.log('Length : '+datastr.length);
    console.log('Sub    : '+datastr.substr(4,4));
    let dataOut = [];
    for (let i=0; i < datastr.length-1; i+=2)
        dataOut.push(parseInt(datastr.substr(i,2),16));
    let output = {"id":outHeader,"data":Buffer.from(dataOut)};
    console.log(output);
    channel.send(output);
});


//channel.addListener("onMessage", channel.send, channel);

channel.start();