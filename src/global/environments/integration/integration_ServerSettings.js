var configuration = {
  strict: false,
  port: 3000,
  solr: {
    host: 'ec2-52-58-151-13.eu-central-1.compute.amazonaws.com',
    port: 8983,
    path: '/solr/Search/select'
  },
  public_key: "-----BEGIN PUBLIC KEY-----\n"+
  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwiFPc0o+YUiBbrXkF7SA"+
  "d7zshZJf2sCvnEy+CTrn5xcJDnbV8x94bxbWari9B3O2cZmcXyNAVBvfsiDXzheJ"+
  "8vX1uotXNiGi3a9yyUCo7Ga8g3QljjMjwHgbUAsIO1tjZL9shSS8qoummqi+c57b"+
  "1nWkpbP8S2eR9Qf2ZVLklIm8alH6IeR1j07Tt9mnUBPG+ivhnmkLHENFYUPjuO4p"+
  "DsRVHGAaXusDDU89R6KGO7UdVOn9GWdTsem27lbCrVE+RqPnTq1WfwalOApwZYeH"+
  "B06Jsi/4FQp+8N3GG3RlzF1boEaN4xzBLzgQ7ll2TlkCWaBpZitqi6gK/aaHrOd7"+
  "IwIDAQAB\n"+
  "-----END PUBLIC KEY-----"
}

console.log("Running as development")

module.exports = configuration
