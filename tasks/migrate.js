var path = require('path'),
  _ = require('lodash');

var SailsIntegration = require('../lib/sailsIntegration'),
  Migrator = require('../lib/migrator');

module.exports = function(grunt) {
  grunt.registerTask("migrate", "Migrate Waterline models", function(action, name) {

    var done = this.async();
    var baseAppPath = process.cwd();
    var modulesPath = path.join(baseAppPath, 'node_modules');
    var migrationsPath = path.join(baseAppPath, 'db', 'migrations')

    // Check if we're migrating or creating new
    switch (action) {
      case 'create':
        if (!name) {
          grunt.log.error('Please specify a name for this migration using migrate:create:{name}.');
          return done(false);
        }
        grunt.log.writeln('Creating new migration...');

        var timestamp = Date.now();
        var template = path.join(__dirname, '../lib/templates/migrationTemplate.js');
        var newFilename = timestamp + '_' + name + '.js';
        grunt.file.copy(template, path.join(migrationsPath, newFilename));

        grunt.log.writeln('Migration ' + newFilename + ' successfully created.');

        done();
        return;

      case 'up':
      case 'down':
        grunt.log.writeln('Migrating database...');

        SailsIntegration.loadSailsConfig(modulesPath, function(err, sailsConfig) {
          if (err) return done(err);

          var config = {
            adapter: sailsConfig.defaultAdapter,
            migrationsDir: migrationsPath
          };
          
          Migrator.migrate(config, action, function(err) {
            if (err) return done(false);

            grunt.log.writeln('Migration complete.');
            done();
          });
        });
        return;

      default:
        grunt.log.error("Unknown command. Please use one of 'migrate:up', 'migrate:down', or 'migrate:create:{name}'.");
        return done(false);
    }
  });
};

