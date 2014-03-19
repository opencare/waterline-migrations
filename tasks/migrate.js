var path = require('path'),
  _ = require('lodash');

var SailsIntegration = require('../lib/sailsIntegration'),
  Migrator = require('../lib/migrator');

module.exports = function(grunt) {
  return grunt.registerTask("migrate", "Migrate Waterline models", function() {
    var baseAppPath, done, modulesPath;

    done = this.async();
    baseAppPath = grunt.config.get('basePath');

    modulesPath = path.join(baseAppPath, 'node_modules');
    return SailsIntegration.loadSailsConfig(modulesPath, function(err, sailsConfig) {
      if (err) {
        return done(err);
      }
      // config = _.extend(config, {
      //   migrationOutDir: path.join(baseAppPath, 'db', 'migrations'),
      //   templatesPath: path.join(__dirname, 'templates')
      // });

      // Check if we're migrating or creating new

      var config = {
        adapter: sailsConfig.defaultAdapter,
        migrationsDir: 'somedir',
        command: argv[0]
      };
      
      Migrator.migrate(config, done); // TODO: pass in arg values
    });
  });
};

