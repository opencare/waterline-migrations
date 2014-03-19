var path = require('path'),
  _ = require('lodash');

var SailsIntegration = require('../lib/sailsIntegration'),
  Migrator = require('../lib/migrator');

module.exports = function(grunt) {
  grunt.registerTask("migrate", "Migrate Waterline models", function(action) {

    var done = this.async();
    var baseAppPath = process.cwd();
    var modulesPath = path.join(baseAppPath, 'node_modules');

    console.log(baseAppPath);

    // Check if we're migrating or creating new
    if (action == 'create') {
      grunt.log.writeln('Creating new migration...');
      done();
    } else if (action == 'up' || action == 'down') {
      grunt.log.writeln('Migrating database...');

      SailsIntegration.loadSailsConfig(modulesPath, function(err, sailsConfig) {
        if (err) return done(err);

        var config = {
          adapter: sailsConfig.defaultAdapter,
          migrationsDir: path.join(baseAppPath, 'db', 'migrations')
        };
        
        Migrator.migrate(config, action, function(err) {
          if (err) return done(false);

          grunt.log.writeln('Migration complete.');
          done();
        });
      });
    } else {
      grunt.log.error("Unknown command. Please use one of 'migrate:create', 'migrate:up', or 'migrate:down'.");
      done(false);
    }
  });
};

