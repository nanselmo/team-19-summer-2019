var map;
var infoWindow;
var request;
var request2;
var request3;
var request4;
var service;
var service2;
var service3;
var service4;
var markers = [];

/**
 * Creates map view of default location with red markers
 * on places that have outdoor pools. 
 */
function initialize() {
    var center = new google.maps.LatLng(38.8819124,-77.1372792);
    map = new google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 13
    });
    request = {
        location: center,
        radius: 8047,
        keyword: 'outdoor swimming pool'
    };
    infoWindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);

    request2 = {
        location: center,
        radius: 8047,
        keyword: 'waterpark'
    };
    service2 = new google.maps.places.PlacesService(map);
    service2.nearbySearch(request2, callback);

    request3 = {
        location: center,
        radius: 8047,
        keyword: 'outdoor pool'
    };
    service3 = new google.maps.places.PlacesService(map);
    service3.nearbySearch(request3, callback);

    request4 = {
        location: center,
        radius: 8047,
        keyword: 'swim club'
    }
    service4 = new google.maps.places.PlacesService(map);
    service4.nearbySearch(request4, callback);

    /**
     * When user right clicks on a different area on the map, the
     * map shows outdoor pools in that area. 
     */
    google.maps.event.addListener(map, 'rightclick', function(event) {
    map.setCenter(event.latLng);
    clearResults(markers);

    var request = {
        location: event.latLng,
        radius: 8047,
        //types: ['pool'],
        keyword: 'outdoor swimming pool'
    };
    service.nearbySearch(request, callback);

    var request2 = {
        location: event.latLng,
        radius: 8047,
        keyword: 'waterpark'
    };
    service2.nearbySearch(request2, callback);

    var request3 = {
        location: event.latLng,
        radius: 8047,
        keyword: 'outdoor pool'
    };
    service3.nearbySearch(request3, callback);

    var request4 = {
        location: event.latLng,
        radius: 8047,
        keyword: 'swim club'
    }
    service4.nearbySearch(request4, callback);
    })
}

/**
 * Create marker for each outdoor pool location and push marker to markers array.
 * @param {var} results
 * @param {var} status
 */
function callback(results, status) {
    if(status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            markers.push(createMarker(results[i]));
        }
    }
}

/**
 * Create marker and show info window with the place name when user clicks on marker.
 * @param {Object} place
 * @return {var} marker 
 */
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
    });
    return marker;
}

/**
 * Reset markers array to an empty array.
 * @param {var} markers
 */
function clearResults(markers) {
    for (var m in markers) {
        markers[m].setMap(null);
    }
    markers = []
}

/* Display map when webpage loads. */
google.maps.event.addDomListener(window, 'load', initialize);
