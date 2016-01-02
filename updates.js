
function updateActive(){
  console.log('updating active');
  var active = {};
  _.each(myActive.keys(), function(key){
    active[key] = myActive.get(key);
  });
  collaborators = myDoc.getCollaborators();
  userDict = _.object(_.map(collaborators, function(item){
    return [item.userId, item];
  }));
  msg = {
    api:'mapi',
    type:'activeChanged',
    sender:'copilot_webpage',
    recipient:'background',
    active: active,
    userDict:userDict
  };
  console.log('sending along message');
  console.log(msg);
  window.postMessage(msg, '*');
}

function updateComments(url){
  changeMessage = {
    name:'updateComments',
    comments:myComments.get(url),
    url:url
  }
  window.postMessage(changeMessage, '*');
}
