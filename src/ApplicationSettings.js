var configuration = {
  domains: {
    API: "https://admin.abroadwith.com",
    API_DOMAIN: "admin.abroadwith.com",
    API_PORT: 443,
    API_HTTP: "https",
    FRONTEND: "http://localhost:3000",
    IMG: "https://img.abroadwith.com",
    LANGUAGE_DOMAIN: "https://{{lang}}.abroadwith.com"
  },
  facebookAppId:"144997212531478"
}

try{
 configuration = require("../application.json");
 console.log("Loaded the following application configuration:",configuration);
}
catch(e){
 console.log("Couldn't load application properties, using development settings.")
}

module.exports = configuration;
