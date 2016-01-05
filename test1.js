/**
 * Created by chris on 12/30/15.
 */
var SerialPort = require("serialport");

var serialPort = new SerialPort.SerialPort("/dev/ttyUSB0", {
    baudrate: 115200,
    parser: SerialPort.parsers.readline('\r\n')
});

serialPort.on('data', function(rawData){
    var data = rawData.split(';');
    //console.log(data);
    if(data[0] == '#r'){
        var rssi = parseInt(data[1]);
        var msg = data[2].split(',');
        //var latitude = parseInt(msg[1].substr(1, 2))+(parseFloat(msg[1].substr(3))/60);
        //var longitude = parseInt(msg[2].substr(1, 2))+(parseFloat(msg[2].substr(3))/60);
        var packet = {
            rssi: rssi,
            msg: {
                timefix: msg[0],
                latitude: parseInt(msg[1].substr(1, 2))+(parseFloat(msg[1].substr(3))/60),
                longitude: -parseInt(msg[2].substr(1, 2))-(parseFloat(msg[2].substr(3))/60),
                altitude: parseInt(msg[3]),
                id: parseInt(msg[4])
            }
        };
        console.log(packet);

    }
});

//setTimeout(function(){
//    console.log("sending 4 bytes");
//    serialPort.write(new Buffer([4, 1, 2, 3, 4]))
//}, 3000);