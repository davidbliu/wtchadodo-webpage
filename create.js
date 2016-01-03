console.log('you are creating a new channel');
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
authorize();

function authorize() {
  realtimeUtils.authorize(function(response){
    var google_root = 'https://www.googleapis.com/oauth2/v3/userinfo?';
    var access_token = response.access_token;
    var id_url = google_root + 'access_token='+access_token;
    $.ajax({
      url: id_url,
      success:function(data){
        myAuth = data;
      }
    });

    if(response.error){
      realtimeUtils.authorize(function(response){
        start();
      }, true);
    } else {
        start();
    }
  }, false);
}


function start() {
  var title = 'HoneyHorse';
}

function createFile(title){
  realtimeUtils.createRealtimeFile(title, function(createResponse) {
    console.log('file created');
    //window.history.pushState(null, null, '?id=' + createResponse.id);
    //realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
  });
}
