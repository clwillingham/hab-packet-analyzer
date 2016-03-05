/**
 * Created by chris on 1/3/16.
 */
var SP = require('serialport');
var crypt = require('crypto');
var crc = require('crc');
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
        console.log(crypt);
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
                self.rssi = packet.rssi;
                var _rawData = 'ALCHAB1,'+
                        packet.msg.id+','+
                        packet.msg.timefix.format('HH:mm:ss')+','+
                        packet.msg.latitude.toFixed(4)+','+
                        packet.msg.longitude.toFixed(4)+','+
                        packet.msg.altitude;
                _rawData += ('*'+crc.crc16ccitt(_rawData).toString(16));
                _rawData = '$$'+_rawData+'\n';
                _rawData = btoa(_rawData);
                habHubPacket = { //EXAMPLE: http://habitat.habhub.org/monocle/?uri=habitat/da1346dc230ce8b5d01b992dc6e0bafe5bbacecb0d83a27cf9e7699055515a0b
                    _id: crypt.createHash('sha256').update(_rawData).digest('hex'),
                    type: 'payload_telemetry',
                    data: {
                        _raw: _rawData/*,
                        _fallbacks: {
                            payload: 'ALCHAB1'
                        }*/
                    },
                    receivers: {
                        imsp_chase_car: {
                            time_created: moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                            time_uploaded: moment().format("YYYY-MM-DDTHH:mm:ssZ")
                        }
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
                console.log(habHubPacket, 'raw:', atob(habHubPacket.data._raw));
            }
        });
    }
});