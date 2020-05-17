const getSettings = async () => {

    const at = await fetch('/app/show_activity_types').then((res) => res.json());
    const ia = await fetch('/app/ignore_activity').then((res) => res.json());
    
    return {
        activity_types: at,
        ignore_activity: ia
    };

}


function getActivites(settings) {
    console.log ("getActivites() called")
    console.log(settings);
}


async function reAuthorize() {
  const settings = await getSettings()

  // getActivites() is only called after getSettings() completes
  getActivites(settings);
}

reAuthorize()