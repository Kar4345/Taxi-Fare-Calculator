$(function () {
    // add input listeners
    google.maps.event.addDomListener(window, "load", function () {
      var from_places = new google.maps.places.Autocomplete(
        document.getElementById("from")
      );
      var to_places = new google.maps.places.Autocomplete(
        document.getElementById("to")
      );

      google.maps.event.addListener(
        from_places,
        "place_changed",
        function () {
          var from_place = from_places.getPlace();
          var from_address = from_place.formatted_address;
          $("#origin").val(from_address);
        }
      );

      google.maps.event.addListener(
        to_places,
        "place_changed",
        function () {
          var to_place = to_places.getPlace();
          var to_address = to_place.formatted_address;
          $("#destination").val(to_address);
        }
      );
    });
    // calculate distance
    function calculateDistance() {
      var origin = $("#origin").val();
      var destination = $("#destination").val();
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
          // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
          avoidHighways: false,
          avoidTolls: false,
        },
        callback
      );
    }
    // get distance results
    function callback(response, status) {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        $("#result").html(err);
      } else {
        var origin = response.originAddresses[0];
        console.log(origin);
        var destination = response.destinationAddresses[0];
        console.log(destination);
        if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
          $("#result_dist").html(
            "Get Flight");
        } else {
          var distance = response.rows[0].elements[0].distance;
          console.log(distance);
          var duration = response.rows[0].elements[0].duration;
          console.log(duration);
          console.log(response.rows[0].elements[0].distance);
          var distance_in_kilo = distance.value / 1000; // the kilom
          var distance_in_mile = distance.value / 1609.34; // the mile
          console.log(distance_in_kilo);
          console.log(distance_in_mile);
          $("#result_dist").html(
            `${distance_in_kilo.toFixed(2)} KMs`
            // Distance in Kilometre: 
          );
          if(distance_in_kilo < 10){
            document.getElementById("fare").innerText = `₹ ${distance_in_kilo.toFixed(2) * 7}`
          }else{
            document.getElementById("fare").innerText = `₹ ${((distance_in_kilo.toFixed(2) * 5)/ 1.5).toFixed(2)}`
          }
        }
      }
    }
    // print results on submit the form
    $("#form").submit(function (e) {
      e.preventDefault();
      calculateDistance();
      
      const info = document.getElementById("to").value; 
      console.log(info) 
      fetch("http://api.openweathermap.org/geo/1.0/direct?q="+info+"&appid=1810fe48ce87d7961f858cf07a4cb708").then(
      response => response.json()).then(data=> {
        console.log(data)
        let lati = data[0].lat;
        let long = data[0].lon;
        fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lati+"&lon="+long+"&units=metric&appid=1810fe48ce87d7961f858cf07a4cb708").then(
            resp => 
                resp.json()
        ).then(data1 => {
            document.getElementById("temp").innerText = `${data1.main.temp}°C in ${data[0].name} Happy Stay!!!`
        }).catch(err=>{
            document.getElementById("temp").innerText = "Weather currently unavailable!"
        })

      }).catch(err=>{
        document.getElementById("temp").innerText = "Weather currently unavailable!"
    });
    });
  });