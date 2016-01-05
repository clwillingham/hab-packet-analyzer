/**
 * Created by chris on 1/4/16.
 */
Vue.directive('map', {
    bind: function(){
        //var myLatLng = {lat: -25.363, lng: 131.044};
        // Create a map object and specify the DOM element for display.
        console.log(this.value);
        var map = L.map('map').setView([0, 0], 13);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var marker = L.marker([0,0]).addTo(map);


        this.map = map;
        this.marker = marker;
    },
    update: function(newVal, oldVal){
        //if(!this.centered){
        //    this.map.panTo(newVal);
        //    this.centered = true;
        //}
        this.marker.setLatLng(newVal);
    },
    unbind: function(){

    }
});