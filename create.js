console.log('you are creating a new channel');
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
authorize();

var FLASK_ROOT = 'http://localhost:5000';
var ROOT_URL = 'http://localhost/copilot';
var docId;

function constructURL(path, params){
  var url = FLASK_ROOT + path;
  var index = 0;
  _.each(_.keys(params),function(key){
    connector = '&';
    if(index == 0){
      connector = '?';
    }
    index++;
    url = url + connector + key+'='+encodeURIComponent(params[key]);
  });
  return url;
}
app.controller('CreateCtrl',function($scope, $http){
  $scope.msg = 'alskdjflskjffsd';
  $scope.createChannel= function(){
    //create the doc
    $scope.statusMsg = 'Creating channel';
    url = constructURL('/create_channel', {
      name: $scope.channelName,
      description: $scope.channelDescription,
      collaborators: $scope.collaborators
    });
    console.log(url);
    $http.get(url)
      .success(function(data){
        console.log('created doc, doc is');
        console.log(data);
        docId = data.id;
        //save the doc
        channel = new DodoChannel();
        channel.set('name', $scope.channelName);
        channel.set('description', $scope.channelDescription);
        channel.set('docId', data.id);
        channel.save(null, {
          success:function(ch){
            initChannel(data.id);
            console.log('channel saved');
          }
        });
      });
    //share the doc
    $scope.statusMsg = 'Sharing channel with collaborators';
    //create the keys root
    $scope.statusMsg = 'Sending you to new channel';
  };
});
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
      realtimeUtils.authorize(function(response){}, true);
    }
  }, false);
}


function initChannel(docId){
  //docId = '0BwLZUlGsG71OczlTczg2amZQbWc';
  console.log('initChannel: '+docId);
  realtimeUtils.load(docId, onFileLoaded, onFileInitialize);
}
function onFileInitialize(model){
  console.log('onFileInitialize');
  model.getRoot().set('test', model.createString());

}
function onFileLoaded(doc){
  console.log('onFileLoaded');
  var model = doc.getModel();
  model.getRoot().set('bookmarks', model.createList());
  model.getRoot().set('tabs', model.createMap());
  model.getRoot().set('history', model.createMap());
  model.getRoot().set('comments', model.createMap());
  model.getRoot().set('active', model.createMap());
  console.log(doc);
  window.location.href = ROOT_URL+'?id='+docId;
}

//function createFile(title){
  //realtimeUtils.createRealtimeFile(title, function(createResponse) {
    //console.log('file created');
    ////window.history.pushState(null, null, '?id=' + createResponse.id);
    ////realtimeUtils.load(createResponse.id, onFileLoaded, onFileInitialize);
  //});
//}
