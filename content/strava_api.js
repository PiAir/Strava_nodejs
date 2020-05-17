const getSettings = async () => {

    const at = await fetch('/app/show_activity_types').then((res) => res.json());
    const ia = await fetch('/app/ignore_activity').then((res) => res.json());
    
    return {
        activity_types: at,
        ignore_activity: ia
    };

}


function getActivites(settings){

    const activities_link = '/athlete/activities'
    fetch(activities_link)
        .then((res) => res.json())
        .then(function (data){
        
            var map = L.map('map');

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
          
            var latlngbounds = new L.latLngBounds(); // contains boundaries of the lines
            
            for(var x=0; x<data.length; x++){
                console.log("X = " + x + " ID = " + data[x].id);
                // only map activities listed in .env (activity_types)
                if (settings.activity_types.includes(data[x].type)) {
                    console.log(data[x].type);
                    if (settings.ignore_activity.includes(data[x].id)) {
                        console.log('activity id is listed as to be ignored, skipping.');
                    } else {    
                        fetch("/activities/"+data[x].id)
                            .then((res) => res.json())
                            .then(function (data){
                                // some activities don't have gps info because they were added manually
                                try {
                                    var polyline = L.Polyline.fromEncoded(data.map.polyline);
                                    latlngbounds.extend(polyline.getBounds()); // store boundary info
                                    var coordinates = L.Polyline.fromEncoded(data.map.polyline).getLatLngs();
                                    L.polyline(
                                        coordinates,
                                        {
                                            color: "#" + Math.floor(Math.random()*16777215).toString(16),
                                            weight:5,
                                            opacity:.7,
                                            lineJoin:'round'
                                        }
                                    ).addTo(map)
                                    map.fitBounds(latlngbounds); // set boundary
                                }
                                catch(err) {
                                     console.log("Cannot read map for activity " + x + " = " + data.name + " ID = " + data.id);
                                }
                            })
                            .catch(error => console.log('error', error));
                    }
                }

            }
          
        })
}

async function showMap() {
  const settings = await getSettings()
  // getActivites() is only called after getSettings() completes
  getActivites(settings);
}

   
showMap();