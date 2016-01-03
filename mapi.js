function mapiListener(){
  console.log('copilot_webpage: started mapi listener');
  window.addEventListener('message', function(event){
  if(event.data && event.data.api && event.data.api == 'mapi'){
    message = event.data;
    handler = mapiHandlers[message.type];
    if(handler != null){
      handler(message);
    }
  }
  });
}

var mapiHandlers = {
  test:function(message){
    console.log('copilot_webpage: this was a test message');
  },
  postComment:function(message){
    console.log('copilot_webpage: posting comment');
    console.log(message);
  },
  tabChange:function(message){
    console.log('copilot_webpage: tabchange');
    var myTabs = message.tabs;
    tabMap.set(myAuth.sub, myTabs);
    //send comments to the activeTab
    active = _.filter(myTabs, function(tab){
      return tab.active;
    });
    myActive.set(myAuth.sub, active[0]);
    //updateComments(active[0].url);
    
  },
  history:function(message){
    console.log('copilot_webpage: history');
    tab = message.tab;
    historyEntry = {
      url: tab.url,
      title: tab.title,
      userId: myAuth.sub,
      faviconUrl: tab.favIconUrl,
      time: (new Date()).getTime(),
      tabId: tab.id,
      windowId: tab.windowId
    };
    hList = myHistory.get(myAuth.sub);
    if(myHistory.get(myAuth.sub) == null){
      myHistory.set(myAuth.sub, [historyEntry])
    }
    else{
      hList = [];
      currentH = myHistory.get(myAuth.sub);
      hList.push(historyEntry);
      lasturls = {};
      lasturls[historyEntry.tabId] = historyEntry.url;
      lastTitles = {};
      lastTitles[historyEntry.tabId] = historyEntry.title;
      seenIds = [];
      for(var i=0;i<currentH.length;i++){
        e = currentH[i];
        if(lasturls[e.tabId] != e.url && lastTitles[e.tabId] != e.title){
          hList.push(e);
          lasturls[e.tabId]=e.url;
          lastTitles[e.tabId] = e.title;
        }
      }
      myHistory.set(myAuth.sub, hList);
    }
  }
}

//send connect message to background
var connectMsg = {
  api:'mapi',
  sender:'copilot_webpage',
  recipient:'background',
  type:'connectCopilot'
}
setTimeout(function(){
  window.postMessage(connectMsg, '*');
}, 5000);
