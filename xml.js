var http = require('http');
var parser = require('xml2json');
var fs = require('fs');

var url = 'http://ws.feedingamerica.org/FAWebService.asmx/GetAllOrganizations';
http.get(url, function (res) {
  var xml = '';
  res.on('data', function (chunk) {
    xml += chunk;
  });  
  res.on('end', function () {
    var json = parser.toJson(xml);  
    
    fs.writeFile('outfromxml.json', json);
    console.log('done');
  })
}).on('error', function(error) {
  console.log(error);
});
