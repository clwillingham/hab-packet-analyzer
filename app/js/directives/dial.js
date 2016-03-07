/**
 * Created by chris on 1/4/16.
 */
Vue.directive('dial', {
    params: [
        'title',
        'min',
        'max',
        'units',
        'greenend',
        'yellowend',
        'greenstart',
        'yellowstart',
        'redstart',
        'redend'
    ],
    bind: function () {
        var self = this;
        $(this.el).highcharts(this.chart = {
                chart: {
                    type: 'gauge',
                    //backgroundColor: 'transparent',
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    borderRadius: 12,
                    plotShadow: false
                },

                title: {
                    text: this.params.title || 'Speed'
                },

                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                },

                // the value axis
                yAxis: {
                    min: this.params.min || 0,
                    max: this.params.max || 200,

                    minorTickInterval: 'auto',
                    minorTickWidth: 1,
                    minorTickLength: 10,
                    minorTickPosition: 'inside',
                    minorTickColor: '#666',

                    tickPixelInterval: 30,
                    tickWidth: 2,
                    tickPosition: 'inside',
                    tickLength: 10,
                    tickColor: '#666',
                    labels: {
                        step: 2,
                        rotation: 'auto'
                    },
                    title: {
                        text: this.params.units || 'km/h'
                    },
                    plotBands: [{
                        from: this.params.greenstart || 0,
                        to: this.params.greenend || 120,
                        color: '#55BF3B' // green
                    }, {
                        from: this.params.yellowstart || this.params.greenend || 120,
                        to: this.params.yellowend || 160,
                        color: '#DDDF0D' // yellow
                    }, {
                        from: this.params.redstart || this.params.yellowend  || 160,
                        to: this.params.redend || this.params.max || 200,
                        color: '#DF5353' // red
                    }]
                },

                series: [{
                    name: 'Speed',
                    data: [0],
                    tooltip: {
                        valueSuffix: ' '+ (this.params.units || 'km/h')
                    }
                }]

            },
            // Add some life
            function (chart) {
                self.chart = chart;
                self.point = chart.series[0].points[0];
                self.point.update(self.value);
                //if (!chart.renderer.forExport) {
                //    setInterval(function () {
                //        var point = chart.series[0].points[0],
                //            newVal,
                //            inc = Math.round((Math.random() - 0.5) * 20);
                //
                //        newVal = point.y + inc;
                //        if (newVal < 0 || newVal > 200) {
                //            newVal = point.y - inc;
                //        }
                //
                //        point.update(newVal);
                //
                //    }, 3000);
                //}
            });
    },
    update: function (newValue, oldValue) {
        if(this.point){
            this.point.update(newValue);
        }
        // do something based on the updated value
        // this will also be called for the initial value
    },
    unbind: function () {
        // do clean up work
        // e.g. remove event listeners added in bind()
    }
});