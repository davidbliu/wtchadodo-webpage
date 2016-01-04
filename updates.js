
function updateActive(prevActive){
  var active = {};
  collaborators = myDoc.getCollaborators();
  userDict = _.object(_.map(collaborators, function(item){
    return [item.userId, item];
  }));
  _.each(_.keys(userDict), function(key){
    activeTab = _.filter(tabMap.get(key), function(tab){
      return tab.active;
    })[0];
    active[key] = activeTab;
  });
  msg = {
    api:'mapi',
    type:'activeChanged',
    sender:'copilot_webpage',
    recipient:'background',
    active: active,
    userDict:userDict
  };
  if(collaborators != null && active != null){
    var send = false;
    activeKeys = _.keys(active);
    prevKeys = _.keys(prevActive);
    _.each(activeKeys, function(key){
      if(!_.contains(prevKeys, key)){
        send = true;
      }
      else{
        if(prevActive[key] == null || prevActive[key].url != active[key].url){
          send = true;
        }
      }
    });
    if(send){
      _.each(prevKeys, function(key){
        if(!_.contains(activeKeys, key)){
          send = true;
        }
      });
      if(send){
        window.postMessage(msg, '*');
      }
    }
  }
  return active;
}

function updateComments(url){
  changeMessage = {
    name:'updateComments',
    comments:myComments.get(url),
    url:url
  }
  window.postMessage(changeMessage, '*');
}
