var map = L.map('map');

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var latlngbounds = new L.latLngBounds(); // contains boundaries of the lines

const getSettings = async () => {

    const at = await fetch('/app/show_activity_types').then((res) => res.json());
    const ia = await fetch('/app/ignore_activity').then((res) => res.json());
    
    return {
        activity_types: at,
        ignore_activity: ia
    };

}

const getAvtivityPage = async function (pageNo = 1) {

    const activities_link = '/athlete/activities/'
    var activityResults = await fetch(activities_link + pageNo)
        .then(res => { return res.json(); });
        
    return activityResults;
}


const getActivites = async function (settings, pageNo = 1) {

    const data = await getAvtivityPage(pageNo);
    console.log("Retreiving data from API for page : " + pageNo);     
    console.log('data.length = ' + data.length);
    if (data.length > 0) {
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
                                    color: "#" + (Math.random().toString(16) + "000000").slice(2, 8),
                                    weight:5,
                                    opacity:.7,
                                    lineJoin:'round'
                                }
                            ).addTo(map)
                            
                        } catch(err) {
                            console.log("Cannot read map for activity " + x + " = " + data.name + " ID = " + data.id);
                        }
                    }).catch(error => console.log('error', error));
                }
            }
        }
        const nextPage = await getActivites(settings, pageNo+1);
    } else {
        console.log(data);
       return;
    }
}

async function showMap() {
  const settings = await getSettings()
  // getActivites() is only called after getSettings() completes
  
  const drawMap = await getActivites(settings);
  map.fitBounds(latlngbounds); // set boundary
}

   
showMap();