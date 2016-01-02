//var PARSE_APP_ID = '9S16GhoFsiKeidxsLDMBvuESYJPWyyacFbd8zgys'; 
//var PARSE_JS_KEY = 'YBqU0O4eqgSh6EdFihUj6jjtznr0SQENfGO6b8lB';
var PARSE_APP_ID = 'XIpP60GkEQF4bQtKFOcceguywNhzOs3Lpsw1H17Z'; 
var PARSE_JS_KEY = 'sqkZKgggrbz6osdU4BopAqhGi9WL5jmXCykZLFPG';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);
var Tweet = Parse.Object.extend("Tweet");
var ParseMember = Parse.Object.extend("ParseMember");
var ParseGoLink = Parse.Object.extend("ParseGoLink");
var ParseGoLinkClick = Parse.Object.extend("ParseGoLinkClick");
var VisualGolink = Parse.Object.extend("VisualGolink");
var Collection = Parse.Object.extend("Collection");
var BlogPost = Parse.Object.extend("BlogPost");
var ParseTablingSlot = Parse.Object.extend("ParseTablingSlot");

// grant access to portal too?

var BlogPostFields = ['createdAt', 'updatedAt', 'view_permissions', 'edit_permissions', 'title', 'author', 'content', 'last_editor' , 'tags'];
function convertParse(parseObject, fields){
  res = {};
  _.each(fields, function(field){
    res[field] = parseObject.get(field);
  });
  res.objectId = parseObject.id;
  return res;
}

function convertParseObjects(parseObjects, fields){
  return _.map(parseObjects, function(obj){
    return convertParse(obj, fields);
  });
}
