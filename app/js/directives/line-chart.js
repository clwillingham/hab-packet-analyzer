/**
 * Created by chris on 3/6/16.
 */
Vue.directive('line-chart', {
    params: [
        'title',
        'yAxis',
        'seriesTitle'
    ],
    bind: function(){
        var self = this;
        $(this.el).highcharts({
            chart: {
                type: 'line',
                //animation: Highcharts.svg, // don't animate in old IE
                borderRadius: 12,
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        self.series = this.series[0];
                        //setInterval(function () {
                        //    var x = (new Date()).getTime(), // current time
                        //        y = Math.random();
                        //    series.addPoint([x, y], true, true);
                        //}, 1000);
                    }
                }
            },
            title: {
                text: this.params.title || 'Data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: this.params.yAxis || 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: this.params.seriesTitle || this.params.title || 'Data',
                //data: [{x: (new Date()).getTime(), y: 0}]
                data: (function () {
                     //generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -36; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: 0
                        });
                    }
                    return data;
                }())
            }]
        });
    },
    update: function(newVal, oldVal){
        if(this.series != null){
            this.series.addPoint([(new Date()).getTime(), newVal], true, true)
        }
    },
    unbind: function(){

    }
});