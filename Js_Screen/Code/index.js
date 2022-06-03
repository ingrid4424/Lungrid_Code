
const express = require('express');
const { Server } = require('socket.io');

const { SerialPort, ReadlineParser } = require('serialport');
        
const app = express();
const httpServer = app.listen(5050);
const ioServer = new Server(httpServer);

const staticDisplay = express.static('public-display');
const staticMobile = express.static('public_mobile');
const staticForm = express.static('public-info');

app.use('/form', staticForm);
app.use('/reward', staticMobile);
app.use('/display', staticDisplay);
app.use(express.json());

let characterMessage = {
    x: 0,
    y: 0
};


let result = {
    timeplay: 0,
    isWin: false,
    isRedeem: false,
}

let nextScreen = 0;

app.get('/test', (req, res) => {
    console.log(req.body);
    res.send({
        m: 'Okay'
    });
});

ioServer.on('connection', (socket) => {
        socket.broadcast.emit('positions', characterMessage);

        socket.on('leds', (leds) =>{
            parser.write(leds + '\n', (err) => {
                if (err) {
                  return console.log('Error on write: ', err.message);
                }
                
              });
        })
});

//------------------------------------------------this opens a port

const protocolConfiguration = {
    path: 'com4',
    baudRate: 250000
}

const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser());

parser.on('data', (data) => {

    console.log({data});

    // Create the array
    let dataArray = data.split(" ");  // 
    ;
    // Parse the Strings to Integer

    //enviar dataArray[1] = X
    characterMessage.x = parseInt(dataArray[1]);
    //enviar dataArray[2] = y
    characterMessage.y = parseInt(dataArray[2]);

    //enviar nextScreen = 0||1
    nextScreen = parseInt(dataArray[3]);
    //console.log(action1 + " " + action2);

    startScreen = parseInt(dataArray[4]);
    // Emit the message using WebSocket to the client
    ioServer.emit('positions', characterMessage);

    ioServer.emit('nextScreen', nextScreen);

    ioServer.emit('startScreen', startScreen);

    ioServer.emit('result', result);
});

