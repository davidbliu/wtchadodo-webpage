var docId = '0BwLZUlGsG71ONks1NUhWaV9abUE' //main doc id
//var docId = '0BwLZUlGsG71OczlTczg2amZQbWc' //test doc id
var clientId = '158145275272-lj3m0j741dj9fp50rticq48vtrfu59jj.apps.googleusercontent.com';
// Create a new instance of the realtime utility with your client ID.
var realtimeUtils = new utils.RealtimeUtils({ clientId: clientId });
var myDoc;
var myAuth;
var tabMap;
var bookmarks;
var myHistory;
var myComments;
var myActive;

function translateTime(timestamp){
  var a= new Date(timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function scrollTabs(id){
  setTimeout(function(){
    $('.collaborator-link').click(function(){
      id = $(this).attr('id').split('-')[0];
      tabs_id = id + '-tabs';
      $("html, body").animate({ scrollTop: $('#'+tabs_id).offset().top }, 100);
    });
  }, 1000);
}

app.controller('CopilotCtrl', function($scope){
  $scope.channelName = 'main';
  $scope.channelDescription= 'Share Wtcha Dodo with your friends';
  $scope.msg = 'hi there';
  $scope.tabDict = {};
  $scope.collaborators = [];
  $scope.historyLimit = 15;

  $scope.translateTime = function(timestamp){
    return translateTime(timestamp);
  }

  $scope.checkHistory = function(userId, tab){
    userLog = myHistory.get(userId);
    tabLog = _.filter(userLog, function(x){
      return x.tabId == tab.id;
    });
    $scope.tabLog= tabLog;
    $scope.modalTitle = 'Tab History';
    $("#myModal").modal();
  }

  $scope.removeTab = function(tab){
    msg = {
      api:'mapi',
      sender: 'copilot_webpage',
      recipient:'background',
      type:'removeTab',
      tab: tab
    }
    window.postMessage(msg, '*');
  }

  $scope.redirectTab = function(tab){
    //redirect instead of opening new tab
  };

  $scope.bookmarkTab = function(tab){
    seen = false;
    _.each(_.range(bookmarks.length), function(i){
      if(bookmarks.get(i).url == tab.url){
        seen = true;
      }
    });
    if(!seen){
      bookmarks.push(tab); 
    }
  }
  function showHistory(userId){
    $scope.historyList = myHistory.get(userId);
    $scope.historyUserId = userId;
    $('.history-checkbox').each(function(){
      $(this).prop('checked', false);
    });
    setTimeout(function(){
      activateTabHover();
    }, 1000);
  }

  $scope.showHistory = function(userId){
    showHistory(userId);
  }
  $scope.removeSelectedHistory = function(){
    var excludes = [];
    $('.history-checkbox:checked').each(function(){
      excludes.push($(this).attr('id'));
    });
    //remove excludes from history
    var currHistory = myHistory.get($scope.historyUserId);
    var newHistory = [];
    _.each(_.range(currHistory.length), function(i){
      var entry = currHistory[i];
      var entryId = entry.tabId+'-'+entry.time;
      if(!_.contains(excludes, entryId)){
        newHistory.push(entry);
      }
    });
    myHistory.set($scope.historyUserId,newHistory);
    showHistory($scope.historyUserId);
  }

  $scope.removeBookmark = function(tab){
    //remove all bookmarks with this tabs url
    marks = _.map(_.range(bookmarks.length), function(i){
      return bookmarks.get(i);
    });
    marks = _.filter(marks, function(x){
      return x.url != tab.url;
    });
    bookmarks.removeRange(0,bookmarks.length);
    _.each(marks, function(mark){
      bookmarks.push(mark);
    });
  }

  $scope.activeClass = function(tab){
    if(tab.active){
      return 'active-tab';
    }
  }
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
          $scope.myAuth = myAuth;
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
    var id = realtimeUtils.getParam('id');
    if(id){
      realtimeUtils.load(id.replace('/', ''), onFileLoaded, onFileInitialize);
    }
    else{
      realtimeUtils.load(docId.replace('/', ''), onFileLoaded, onFileInitialize);
    }
  }
  function onFileInitialize(model) {
    var string = model.createString();
    string.setText('Welcome to the Quickstart App!');
    model.getRoot().set('demo_string', string);
  }
  function onFileLoaded(doc) {
    myDoc = doc;
    keys = myDoc.getModel().getRoot().keys();
    //get tabMap for currently open tabs
    tabMap = myDoc.getModel().getRoot().get('tabs');
    tabMap.addEventListener( gapi.drive.realtime.EventType.VALUE_CHANGED, function(event){
      translateTabMap(tabMap);
    });
    //get bookmarks
    bookmarks = myDoc.getModel().getRoot().get('bookmarks');
    bookmarks.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, function(event){
      translateBookmarks(bookmarks);
    });
    translateBookmarks(bookmarks);

    //get history
    myHistory = myDoc.getModel().getRoot().get('history');
    $scope.history = myHistory;
    // get comments
    myComments = myDoc.getModel().getRoot().get('comments');
    $scope.comments = myComments;
    myComments.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, function(event){
      console.log('real: updating comments');
    });
    // active
    mapiListener(); // see the mapi.js file
    handleCollaborators();
    $scope.$digest();
  }

  
  function updateCollaborators(){
    $scope.collaborators = myDoc.getCollaborators();
    $scope.userDict = _.object(_.map($scope.collaborators, function(item){
      return [item.userId, item];
    }));
    scrollTabs();
    translateTabMap(tabMap);
  }

  function handleCollaborators(){
    updateCollaborators();
    myDoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, function(){
      updateCollaborators();
    });
    myDoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, function(){
      updateCollaborators();
    });
  }

  function translateBookmarks(bookmarks){
    $scope.bookmarks = _.map(_.range(bookmarks.length), function(i){
      return bookmarks.get(i);
    }).reverse();
    setTimeout(function(){
      activateTabHover();
    }, 1000);
    $scope.$digest();
  }

  function translateTabMap(tabMap){
    var userids = _.keys($scope.userDict);
    $scope.tabDict = {};
    _.each(tabMap.keys(), function(key){
      if(_.contains(userids, key)){
        $scope.tabDict[key] = tabMap.get(key);
      }
    });
    $scope.userIds = _.keys($scope.tabDict);
    $scope.myActive = updateActive($scope.myActive);
    $scope.$digest();
    activateTabHover();
  }
});//end of a super long controller

function activateTabHover(){
  $('.tab-li').unbind('mouseenter mouseleave');
  $('.tab-li').hover(function(){
    $(this).find('.tab-icons').show();
  }, function(){
    $(this).find('.tab-icons').hide();
  });
  $('.dodo-link').unbind('click');
  $('.dodo-link').click(function(){
    if(ACK){
      msg = {
        api:'mapi',
        sender:'copilot_webpage',
        recipient:'background',
        type:'redirectLink',
        tabId: $(this).attr('data-tabid'),
        url: $(this).attr('data-url') 
      }
      window.postMessage(msg, '*');
    }
    else{
      window.location.href = url;
    }
  });
}

function testMessage(){
  msg = {
    api:'mapi',
    recipient:'content',
    url: 'https://github.com/timdown/rangy/wiki/Serializer-Module',
    sender:'copilot_webpage',
    type:'test'
  }
  window.postMessage(msg, '*');
}
