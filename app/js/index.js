/**
 * Created by chris on 1/3/16.
 */
var SP = require('serialport');
var serialPort = new SP.SerialPort('/dev/ttyUSB0', {
    baudrate: 115200,
    parser:SP.parsers.readline('\r\n')
});

$(window).on('resize', handleResize);

function handleResize(){

}


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
        $.couch.urlPrefix = "http://habitat.habhub.org";
        window.db = $.couch.db("habitat");
        serialPort.on('data', function(rawData){
            var data = rawData.split(';');
            console.log(data);
            if(data[0] == '#r'){
                var rssi = parseInt(data[1]);
                var habHubPacket;
                var msg = data[2].split(',');
                //var packet = {
                //    rssi: rssi,
                //    msg: {
                //        timefix: parseInt(msg[0]),
                //        latitude: parseInt(msg[1].substr(1, 2))+(parseFloat(msg[1].substr(3))/60),
                //        longitude: -parseInt(msg[2].substr(1, 2))-(parseFloat(msg[2].substr(3))/60),
                //        altitude: parseFloat(msg[3])*3.28084,
                //        id: parseInt(msg[4])
                //    }
                //};
                var packet = {
                    rssi: rssi,
                    msg: {
                        id: parseInt(msg[0]),
                        timefix: moment.unix(parseInt(msg[1])),
                        latitude: parseFloat(msg[2]),//parseInt(msg[2].substr(1, 2))+(parseFloat(msg[2].substr(3))/60),
                        longitude: -parseFloat(msg[3]),//-parseInt(msg[3].substr(1, 2))-(parseFloat(msg[3].substr(3))/60),
                        altitude: parseFloat(msg[4])
                    }
                };
                console.log(packet.msg.latitude, packet.msg.longitude);
                self.latitude = Math.round(packet.msg.latitude/100)+((packet.msg.latitude%100)/60);
                self.longitude =Math.round(packet.msg.longitude/100)+((packet.msg.longitude%100)/60);
                self.timefix = packet.msg.timefix;
                self.altitude = packet.msg.altitude;
                self.id = packet.msg.id;
                self.rssi = packet.rssi
                habHubPacket = {
                    type: 'payload_telemetry',
                    data: {
                        _raw: btoa(
                            '$$ALCHAB1,'+
                                packet.msg.id+','+
                                packet.msg.timefix.format('HH:mm:ss')+','+
                                packet.msg.latitude+','+
                                packet.msg.longitude+','+
                                packet.msg.altitude
                            )/*,
                        latitude: self.latitude,
                        longitude: self.longitude,
                        altitude: self.altitude*/
                    }
                };
                db.saveDoc(habHubPacket, {
                    success: function(result){
                        console.log(result);
                    },
                    error: function(result){
                        console.log('error', result);
                    }
                });
                console.log(habHubPacket);
            }
        });
    }
});