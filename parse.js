var PARSE_APP_ID = 'XIpP60GkEQF4bQtKFOcceguywNhzOs3Lpsw1H17Z'; 
var PARSE_JS_KEY = 'sqkZKgggrbz6osdU4BopAqhGi9WL5jmXCykZLFPG';
Parse.initialize(PARSE_APP_ID, PARSE_JS_KEY);

var DodoChannel = Parse.Object.extend('DodoChannel');

var DodoChannelFields = ['docId', 'title'];

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
