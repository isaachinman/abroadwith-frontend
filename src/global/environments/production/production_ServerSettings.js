module.exports = {
  strict: true,
  port:3000,
  redirect_domain: ".abroadwith.com",
  cookieDomain: ".abroadwith.com",
  solr: {
    "host": "localhost",
    "port": 8983,
    "path": "/solr/Search/select"
  },
  facebookAppId:"144948059203060",
  public_key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwiFPc0o+YUiBbrXkF7SAd7zshZJf2sCvnEy+CTrn5xcJDnbV8x94bxbWari9B3O2cZmcXyNAVBvfsiDXzheJ8vX1uotXNiGi3a9yyUCo7Ga8g3QljjMjwHgbUAsIO1tjZL9shSS8qoummqi+c57b1nWkpbP8S2eR9Qf2ZVLklIm8alH6IeR1j07Tt9mnUBPG+ivhnmkLHENFYUPjuO4pDsRVHGAaXusDDU89R6KGO7UdVOn9GWdTsem27lbCrVE+RqPnTq1WfwalOApwZYeHB06Jsi/4FQp+8N3GG3RlzF1boEaN4xzBLzgQ7ll2TlkCWaBpZitqi6gK/aaHrOd7IwIDAQAB\n-----END PUBLIC KEY-----"
}

console.log("Running as production")
