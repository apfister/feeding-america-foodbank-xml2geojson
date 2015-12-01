# feeding-america-foodbank-xml2geojson
XML to GeoJSON of Feeding America Food Banks

- Feeding America has a [Food Bank Locator](http://www.feedingamerica.org/find-your-local-foodbank/) 

- This is fed by an XML Feed located [here](http://ws.feedingamerica.org/FAWebService.asmx/GetAllOrganizations)


##Setup
- clone repo
- cd into directory && `npm install`
- `node index.js` and you should get a GeoJSON file of all food bank locations to play with