const net = require('net')

exports.cbusServer = function (NET_PORT) {
    let clients = []

    const server = net.createServer(function (socket) {
        socket.setKeepAlive(true, 60000)
        clients.push(socket)
        console.log('Client Connected to Server')
        socket.on('data', function (data) {
            let outMsg = data.toString().split(";");
            for (let i = 0; i < outMsg.length - 1; i++) {
                broadcast(outMsg[i] + ';', socket)
                console.log('Server Broadcast : ' + data.toString());
            }
        });

        socket.on('end', function () {
            clients.splice(clients.indexOf(socket), 1)
            console.log('Client Disconnected')
            //winston.info({message: `Client Disconnected`})
        })

        socket.on("error", function (err) {
            clients.splice(clients.indexOf(socket), 1)
            console.log(`Caught flash policy server socket error:   : ${err.stack}`)
            //console.log(err.stack)
            //winston.info({message: `Caught flash policy server socket error:   : ${err.stack}`})
        })

        function broadcast(data, sender) {
            clients.forEach(function (client) {
                // Don't want to send it to sender
                if (client === sender)
                    return
                if (data.length > 8) {
                    client.write(data)
                    //winston.info({message: `CbusServer Broadcast : ${data.toString()}`})
                    console.log(`CbusServer Broadcast : ${data.toString()}`)
                } else {
                    console.log(`CbusServer Invalid Message : ${data.toString()}`)
                    //winston.info({message: `CbusServer Invalid Message : ${data.toString()}`})
                }
            })
        }
    })
    server.listen(NET_PORT)
}