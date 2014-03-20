var SailsIntegration, path;

path = require('path');

var cache, sailsPath;

var SailsIntegration = {};

cache = null;

sailsPath = function(modulesPath) {
  return path.join(modulesPath, 'sails');
};

SailsIntegration.loadSailsConfig = function(modulesPath, cb) {
  var options, sails;
  if (cache) {
    return cb(null, cache);
  }
  options = {
    globals: false,
    loadHooks: ['moduleloader', 'userconfig', 'orm'],
    appPath: path.join(modulesPath, "..")
  };
  sails = require(sailsPath(modulesPath));
  return sails.load(options, (function(_this) {
    return function(err) {
      if (err) {
        return cb(err);
      }
      cache = _this.getSailsConfig(modulesPath, sails);
      return cb(null, cache);
    };
  })(this));
};

SailsIntegration.getSailsConfig = function(modulesPath, sails) {
  var defaultAdapterName = sails.config.models.connection;
  var dbConfig = sails.config.connections[defaultAdapterName];

  var adapter = require(path.join(modulesPath, dbConfig.adapter));
  adapter.config = dbConfig;
  return {
    migrationLibPath: __dirname,
    defaultAdapterName: defaultAdapterName,
    defaultAdapter: adapter,
    sailsPath: sailsPath(modulesPath)
  };
};

module.exports = SailsIntegration;
