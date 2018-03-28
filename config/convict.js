var convict = require('convict');
var request = require('request');
var fs = require('fs');

module.exports = new Promise(function (resolve, reject) {
  var conf = convict({
    env: {
      doc: "The applicaton environment.",
      format: [ "production", "development" ],
      default: "development",
      env: "NODE_ENV"
    },
    configUrl: {
      doc: "URL for where to read the configuration",
      format: "*",
      default: "http://rutebanken.org/do_not_read",
      env: "CONFIG_URL"
    },
    organisationsBaseUrl: {
      doc: "Base URL for for Organisations API including slash",
      format: "url",
      default: "http://baba:16001/services/organisations/",
      env: "ORGANISATIONS_BASE_URL"
    },
    providersBaseUrl: {
      doc: "Base URL for for Providers API including slash",
      format: "url",
      default: "http://baba:16001/services/providers/",
      env: "PROVIDERS_BASE_URL"
    },
    eventsBaseUrl: {
      doc: "Base URL for for Events API including slash",
      format: "url",
      default: "http://marduk:8888/services/events/",
      env: "EVENTS_BASE_URL"
    },
    nabuEventsBaseUrl: {
      doc: "Base URL for for Events API including slash",
      format: "url",
      default: "http://localhost:9004/services/events/",
      env: "NABU_EVENTS_BASE_URL"
    },
    timetableAdminBaseUrl: {
      doc: "Base URL for for Timatable admin API including slash",
      format: "url",
      default: "http://marduk:8888/services/timetable_admin/",
      env: "TIMETABLE_ADMIN_BASE_URL"
    },
    mapAdminBaseUrl: {
      doc: "Base URL for for Map admin API including slash",
      format: "url",
      default: "http://marduk:8888/services/map_admin/",
      env: "MAP_ADMIN_BASE_URL"
    },
    mapboxAdminBaseUrl: {
      doc: "Base URL for for Mapbox admin API including slash",
      format: "url",
      default: "http://marduk:8888/services/mapbox_admin/",
      env: "MAPBOX_ADMIN_BASE_URL"
    },
    geocoderAdminBaseUrl: {
      doc: "Base URL for for Geocoder admin API including slash",
      format: "url",
      default: "http://marduk:8888/services/geocoder_admin/",
      env: "GEOCODER_ADMIN_BASE_URL"
    },
    endpointBase: {
      doc: "Namespace for client including slash, e.g. /admin/bel/",
      format: String,
      default: "/",
      env: "ENDPOINTBASE"
    },
    authServerUrl: {
      doc: "URL to keycloak auth server",
      format: String,
      default: "https://auth-rmr.nouvelle-aquitaine.pro/auth",
      env: "AUTH_SERVER_URL"
    },
    chouetteBaseUrl: {
      doc: "URL to Chouette UI",
      format: String,
      default: "http://chouette2:3000/",
      env: "CHOUETTE_BASE_URL"
    },

  });

  // If configuration URL exists, read it and update the configuration object
  var configUrl = conf.get('configUrl');

  console.log("configUrl", configUrl);

  if (configUrl.indexOf("do_not_read") == -1) {
    // Read contents from configUrl if it is given
    request(configUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body)
        conf.load(body);
        conf.validate();
        resolve(conf)
      } else {
        reject("Could not load data from " + configUrl, error)
      }
    });
  } else {
    console.log("The CONFIG_URL element has not been set, so you use the default dev-mode configuration")
    conf.validate();
    resolve(conf)
  }
})
