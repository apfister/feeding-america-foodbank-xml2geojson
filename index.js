var http = require('http');
var parser = require('xml2json');
var fs = require('fs');

function parseBool(val) {
  return val === 'true' ? 'Yes' : 'No';
}

function downloadXml() {
  var url = 'http://ws.feedingamerica.org/FAWebService.asmx/GetAllOrganizations';
  http.get(url, function (res) {
    var xml = '';
    res.on('data', function (chunk) {
      xml += chunk;
    });  
    res.on('end', function () {
      var parsedJson = parser.toJson(xml);

      // fs.writeFile('outfromxml.json', parsedJson);

      createGeoJson( JSON.parse(parsedJson) );

    })
  }).on('error', function(error) {
    console.log(error);
  });
}

function createGeoJson (parsedJson) {

  var orgs = parsedJson.ArrayOfOrganization.Organization;

  var featureCollection = {
    'type' : 'FeatureCollection'
  };
  var features = [], org, feature, props, geometry;
  for (var i=0;i < orgs.length;i++) {
    org = orgs[i];

    feature = {
      "type" : "Feature",
      "geometry" : {
        "type" : "Point",
        "coordinates" : []
      },
      "properties" : null
    };

    props = {};

    // core attributes
    props.entityId = org.EntityID;
    props.FullName = org.FullName;
    props.type = org.Type;
    props.subType = org.SubType;

    var addressInfo = org.MailAddress;

    props.address1 = addressInfo.Address1;
    props.address2 = addressInfo.Address2;
    props.city = addressInfo.City;
    props.state = addressInfo.State;
    props.zip = addressInfo.Zip;
    props.zip4 = addressInfo.ZipPlus4;
    props.zipFull = addressInfo.FullZip;
    
    feature.geometry.coordinates[0] = parseFloat(addressInfo.Longitude);
    feature.geometry.coordinates[1] = parseFloat(addressInfo.Latitude);

    props.phone = org.Phone;
    props.fax = org.Fax;
    
    props.region = org.Region;
    props.url = org.URL;
    props.agencyUrl = org.AgencyURL;

    // stats
    if (org.DemographicStats) {
      props.Demographic_NumberOfCounties = parseInt(org.DemographicStats.NumberOfCounties);
    }
    if (org.OperationsStats) {
      props.Operations_VolunteerHours = parseInt(org.OperationsStats.VolunteerHours);
    }

    if (org.FoodDistributionProgStats) {
      var fdps = org.FoodDistributionProgStats;
      props.FoodDistProg_PreparedFoods = parseBool(fdps.PreparedFoods);
      props.FoodDistProg_FreshProduce = parseBool(fdps.FreshProduce);
      props.FoodDistProg_Fish = parseBool(fdps.Fish['xsi:nil']);
      props.FoodDistProg_RepackBulk = parseBool(fdps.RepackBulk);
      props.FoodDistProg_Salvage = parseBool(fdps.Salvage);
      props.FoodDistProg_MobilePantry = parseBool(fdps.MobilePantry);
      props.FoodDistProg_BrownBag = parseBool(fdps.BrownBag);
      props.FoodDistProg_PurchaseProgram = parseBool(fdps.PurchaseProgram);
      props.FoodDistProg_TefapProgram = parseBool(fdps.TefapProgram);
      props.FoodDistProg_CsfpProgram = parseBool(fdps.CsfpProgram);
      props.FoodDistProg_PurchaseProgram = parseBool(fdps.PurchaseProgram);
      props.FoodDistProg_DisasterProgram = parseBool(fdps.DisasterProgram['xsi:nil']);
      props.FoodDistProg_DeliveryProgram = parseBool(fdps.DeliveryProgram['xsi:nil']);
      props.FoodDistProg_AfterSchoolSnacks = parseBool(fdps.AfterSchoolSnacks);
      props.FoodDistProg_CACFP = parseBool(fdps.CACFP);
      props.FoodDistProg_CommunityKitchen = parseBool(fdps.CommunityKitchen);
      props.FoodDistProg_NonFoodDistribution = parseBool(fdps.NonFoodDistribution);
      props.FoodDistProg_PantryShopping = parseBool(fdps.PantryShopping['xsi:nil']);
      props.FoodDistProg_ProductionKitchen = parseBool(fdps.ProductionKitchen);
      props.FoodDistProg_SFSP = parseBool(fdps.SFSP);
      props.FoodDistProg_OtherService = fdps.OtherService;
      props.FoodDistProg_SeniorCongregate = parseBool(fdps.SeniorCongregate);
      props.FoodDistProg_SeniorMealDelivery = parseBool(fdps.SeniorMealDelivery);
      props.FoodDistProg_Composting = parseBool(fdps.Composting);
      props.FoodDistProg_Grower = parseBool(fdps.Grower['xsi:nil']);
      props.FoodDistProg_SchoolPantries = parseBool(fdps.SchoolPantries);
      props.FoodDistProg_WIC = parseBool(fdps.WIC);
      props.FoodDistProg_Reclamation = parseBool(fdps.Reclamation);
      props.FoodDistProg_OnSiteClientPantry = parseBool(fdps.OnSiteClientPantry);
      props.FoodDistProg_OnSiteAgencyShopping = parseBool(fdps.OnSiteAgencyShopping);
      props.FoodDistProg_OnSiteCongregateFeeding = parseBool(fdps.OnSiteCongregateFeeding);
      props.FoodDistProg_MealsOnWheels = parseBool(fdps.MealsOnWheels);
      props.FoodDistProg_FarmOrchardRaiseFish = parseBool(fdps.FarmOrchardRaiseFish);
      props.FoodDistProg_CommunityGarden = parseBool(fdps.CommunityGarden);
    }

    if (org.ClientSupportProgStats) {
      var csps = org.ClientSupportProgStats;
      props.ClientSupportProg_EligibilityCounselng = parseBool(csps.EligibilityCounselng);
      props.ClientSupportProg_FoodStampOutreach = parseBool(csps.FoodStampOutreach);
      props.ClientSupportProg_JobTraining = parseBool(csps.JobTraining);
      props.ClientSupportProg_LegalAssistance = parseBool(csps.LegalAssistance);
      props.ClientSupportProg_NutritionEducation = parseBool(csps.NutritionEducation);
      props.ClientSupportProg_ShortTermFinAssist = parseBool(csps.ShortTermFinAssist);
      props.ClientSupportProg_UtilityHeatAssistance = parseBool(csps.UtilityHeatAssistance);
      props.ClientSupportProg_HousingAssistance = parseBool(csps.HousingAssistance);
    }

    if (org.NationalProgStats) {
      props.NationalProg_BackPack = parseBool(org.NationalProgStats.BackPack);
      props.NationalProg_KidsCafes = parseBool(org.NationalProgStats.KidsCafes);
    }

    if (org.PoundageStats) {
      props.PoundageStats_TotalPoundage = parseInt(org.PoundageStats.TotalPoundage);
      props.PoundageStats_Meals = parseInt(org.PoundageStats.Meals);
      props.PoundageStats_ShowMeals = parseBool(org.PoundageStats.ShowMeals);
    }

    if (org.AgenciesServedStats) {
      var ass = org.AgenciesServedStats;
      props.AgenciesServed_EmergencyBox = parseInt(ass.EmergencyBox);
      props.AgenciesServed_SoupKitchens = parseInt(ass.SoupKitchens);
      props.AgenciesServed_Shelters = parseInt(ass.Shelters);
      props.AgenciesServed_Residential = parseInt(ass.Residential);
      props.AgenciesServed_DayCare = parseInt(ass.DayCare);
      props.AgenciesServed_MultiService = parseInt(ass.MultiService);
      props.AgenciesServed_Senior = parseInt(ass.Senior);
      props.AgenciesServed_Rehabilitation = parseInt(ass.Rehabilitation);
      props.AgenciesServed_YouthPrograms = parseInt(ass.YouthPrograms);
      props.AgenciesServed_Other = parseInt(ass.Other);
    }

    // executive director
    if (org.ED) {
      var ed = org.ED;
      props.ED_FirstName = ed.FirstName;
      props.ED_LastName = ed.LastName;
      props.ED_Title = ed.Title;
      props.ED_Phone1main = ed.Phone1main;
      props.ED_Phone1ext = ed.Phone1ext;
      props.ED_Phone1 = ed.Phone1;
      props.ED_Fax = ed.Fax;
      props.ED_Email = ed.Email;
      props.ED_OrganizationEntityID = parseInt(ed.OrganizationEntityID);
    }

    // media contact
    if (org.MediaContact) {
      var mc = org.MediaContact;
      props.MC_FirstName = mc.FirstName;
      props.MC_LastName = mc.LastName;
      props.MC_Title = mc.Title;
      props.MC_Phone1main = mc.Phone1main;
      props.MC_Phone1ext = mc.Phone1ext;
      props.MC_Phone1 = mc.Phone1;
      props.MC_Fax = mc.Fax;
      props.MC_Email = mc.Email;
      props.MC_OrganizationEntityID = parseInt(mc.OrganizationEntityID);
    }

    // social attributes
    var socialUrls = org.SocialUrls;
    props.SOCIAL_Twitter = socialUrls.Twitter;
    props.SOCIAL_FaceBook = socialUrls.FaceBook;
    props.SOCIAL_LinkedIn = socialUrls.LinkedIn;
    props.SOCIAL_Youtube = socialUrls.Youtube;
    props.SOCIAL_Pinterest = socialUrls.Pinterest;
    props.SOCIAL_DonateUrl = socialUrls.DonateUrl;
    props.SOCIAL_WebUrl = socialUrls.WebUrl;
    
    // volunteer attributes
    props.VOLUNTEER_URL = org.VolunteerUrl;
    props.VOLUNTEER_Coordinator = org.VolunteerCoord;
    props.VOLUNTEER_Email = org.VolunteerEmail;
    props.VOLUNTEER_Phone = org.VolunteerPhone;
    props.VOLUNTEER_PhoneExt = org.VolunteerPhoneExtension;

    // logos
    var logoUrls = org.LogoUrls;
    props.LOGO_FoodBankLocator = logoUrls.FoodBankLocator;
    props.LOGO_OnlineMarketPlace = logoUrls.OnlineMarketPlace;
    props.LOGO_SecureConvioMain = logoUrls.SecureConvioMain;

    feature.properties = props;

    features.push( feature );
  }

  featureCollection.features = features;
  fs.writeFile('Food Banks.geojson', JSON.stringify(featureCollection));
}

downloadXml();