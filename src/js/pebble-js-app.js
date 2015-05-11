var xhrRequest = function (url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
};

function locationSuccess (pos) {
  console.log("pos = " +pos);
  // construct url
  var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + pos.coords.latitude + '&lon=' + pos.coords.longitude;
  console.log("url = " +url)
  // send request to OpenWeatherMap
  xhrRequest(url, 'GET', function(responseText){
    // responseText contains a JSON object with weather info 
    var json = JSON.parse(responseText);
    console.log(responseText);
    // Temperature in Kelvin requires adjusment
    var temperature = Math.round(json.main.temp - 273.15);
    console.log("The Temperature is "+ temperature);

    //Conditions
    var conditions = json.weather[0].main;
    console.log('The Condition is '+conditions);

    // Assemble dictionary using our keys
    var dictionary = {
      'KEY_TEMPERATURE': temperature,
      'KEY_CONDITIONS': conditions
    };

    // Send to Pebble
    Pebble.sendAppMessage(dictionary,
        function(e) {
          console.log('Weather info sent to Pebble successfully!');
        },
        function(e) {
          console.log('Error sending weather info to Pebble!');
        }
    );
  });
}

function locationError(err) {
  console.log('Error requesting location!');
}

function getWeather() {
  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationError,
    {timeout: 15000, maximumAge: 6000}
  );
}

// Listen for when the watchface is opened
Pebble.addEventListener('ready',function(e) {
  console.log('PebbleKit JS Ready');
  getWeather();
});

// Listen for when an AppMessage is recived
Pebble.addEventListener('appmessage',function(e) {
  console.log('AppMessage recived!');
  getWeather();
});

