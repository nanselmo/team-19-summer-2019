var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');

var countries = {
'au': {
    center: {lat: -25.3, lng: 133.8},
    zoom: 4
},
'br': {
    center: {lat: -14.2, lng: -51.9},
    zoom: 3
},
'ca': {
    center: {lat: 62, lng: -110.0},
    zoom: 3
},
'fr': {
    center: {lat: 46.2, lng: 2.2},
    zoom: 5
},
'de': {
    center: {lat: 51.2, lng: 10.4},
    zoom: 5
},
'mx': {
    center: {lat: 23.6, lng: -102.5},
    zoom: 4
},
'nz': {
    center: {lat: -40.9, lng: 174.9},
    zoom: 5
},
'it': {
    center: {lat: 41.9, lng: 12.6},
    zoom: 5
},
'za': {
    center: {lat: -30.6, lng: 22.9},
    zoom: 5
},
'es': {
    center: {lat: 40.5, lng: -3.7},
    zoom: 5
},
'pt': {
    center: {lat: 39.4, lng: -8.2},
    zoom: 6
},
'us': {
    center: {lat: 37.1, lng: -95.7},
    zoom: 3
},
'uk': {
    center: {lat: 54.8, lng: -4.6},
    zoom: 5
}
};

function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    zoom: countries['us'].zoom,
    center: countries['us'].center,
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
});

infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
});

autocomplete = new google.maps.places.Autocomplete(
    /** @type {!HTMLInputElement} */ (
        document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
    });
places = new google.maps.places.PlacesService(map);
autocomplete.addListener('place_changed', onPlaceChanged);

document.getElementById('country').addEventListener(
    'change', setAutocompleteCountry);
}
function onPlaceChanged() {
var place = autocomplete.getPlace();
if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    search();
} else {
    document.getElementById('autocomplete').placeholder = 'Enter a city';
}
}

function search() {
var search = {
    location: map.getCenter(),
    keyword: "swimming pool",
    radius: 8047
};
places.nearbySearch(search, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
    clearResults();
    clearMarkers();
    for (var i = 0; i < results.length; i++) {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';
        markers[i] = new google.maps.Marker({
        position: results[i].geometry.location,
        animation: google.maps.Animation.DROP,
        icon: markerIcon
        });
        markers[i].placeResult = results[i];
        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);
    }
    }
}
function clearMarkers() {
for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
    markers[i].setMap(null);
    }
}
markers = [];
}

function setAutocompleteCountry() {
var country = document.getElementById('country').value;
if (country == 'all') {
    autocomplete.setComponentRestrictions({'country': []});
    map.setCenter({lat: 15, lng: 0});
    map.setZoom(2);
} else {
    autocomplete.setComponentRestrictions({'country': country});
    map.setCenter(countries[country].center);
    map.setZoom(countries[country].zoom);
}
clearResults();
clearMarkers();
}

function dropMarker(i) {
return function() {
    markers[i].setMap(map);
};
}

function addResult(result, i) {
var results = document.getElementById('results');
var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
var markerIcon = MARKER_PATH + markerLetter + '.png';

var tr = document.createElement('tr');
tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
};

var iconTd = document.createElement('td');
var nameTd = document.createElement('td');
var icon = document.createElement('img');
icon.src = markerIcon;
icon.setAttribute('class', 'placeIcon');
icon.setAttribute('className', 'placeIcon');
var name = document.createTextNode(result.name);
iconTd.appendChild(icon);
nameTd.appendChild(name);
tr.appendChild(iconTd);
tr.appendChild(nameTd);
results.appendChild(tr);
}

function clearResults() {
var results = document.getElementById('results');
while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
}
}

function showInfoWindow() {
var marker = this;
places.getDetails({placeId: marker.placeResult.place_id},
    function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
    });
}

function buildIWContent(place) {
document.getElementById('iw-icon').innerHTML = '<img class="poolIcon" ' +
    'src="images/pool.png" style="width:36px;height:36px;"/>';
document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
    '">' + place.name + '</a></b>';
document.getElementById('iw-address').textContent = place.vicinity;

if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
} else {
    document.getElementById('iw-phone-row').style.display = 'none';
}

if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
    if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
    } else {
        ratingHtml += '&#10029;';
    }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
} else {
    document.getElementById('iw-rating-row').style.display = 'none';
}

if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
    website = 'http://' + place.website + '/';
    fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
} else {
    document.getElementById('iw-website-row').style.display = 'none';
}
    if(place.opening_hours) {
        var hours = place.opening_hours;
        document.getElementById('iw-openhours-row').style.display = '';
        var text = "";
        for(var i=0; i< 7; i++) {
            text += hours.weekday_text[i] + "<br/>";
        }
        document.getElementById('iw-openhours').innerHTML = text;
    } else {
        document.getElementById('iw-openhours-row').style.display = 'none';
    }
}
