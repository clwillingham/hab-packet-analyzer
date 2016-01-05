/**
 * Created by chris on 1/3/16.
 */
var SP = require('serialport');
var serialPort = new SP.SerialPort('/dev/ttyUSB0', {
    baudrate: 115200,
    parser:SP.parsers.readline('\r\n')
});

var app = new Vue({
    el: '#app',
    data: {
        timefix: 0,
        latitude: 0,
        longitude: 0,
        altitude: 0,
        rssi: 0,
        id: 0
    },
    ready: function(){
        var self = this;
        serialPort.on('data', function(rawData){
            var data = rawData.split(';');
            console.log(data);
            if(data[0] == '#r'){
                var rssi = parseInt(data[1]);
                var msg = data[2].split(',');
                var packet = {
                    rssi: rssi,
                    msg: {
                        timefix: parseInt(msg[0]),
                        latitude: parseInt(msg[1].substr(1, 2))+(parseFloat(msg[1].substr(3))/60),
                        longitude: -parseInt(msg[2].substr(1, 2))-(parseFloat(msg[2].substr(3))/60),
                        altitude: parseFloat(msg[3])*3.28084,
                        id: parseInt(msg[4])
                    }
                };
                self.latitude = packet.msg.latitude;
                self.longitude = packet.msg.longitude;
                self.timefix = packet.msg.timefix;
                self.altitude = packet.msg.altitude;
                self.id = packet.msg.id;
                self.rssi = packet.rssi
            }
        });
    }
});