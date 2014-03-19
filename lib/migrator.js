var Waterline = require('waterline');

var Migrator = {};

function createSchemaTable(cb) {
  var SchemaMigrationDefinition = Waterline.Collection.extend({
    tableName: 'schema_migrations',
    migrate: 'safe',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
      version: {
        type: 'STRING',
        primaryKey: true,
        required: true,
        index: true
      }
    }
  });

  var options = {
    adapters: {
      adapter: config.defaultAdapter
    }
  };

  var schemaTable = new SchemaMigrationDefinition(options, function(err, Model) {
    if (err) return cb(err);

    Model.describe(function(err, existingAttributes) {
      if (err) return cb(err);

      // Check if table exists
      if (existingAttributes) {
        return cb(Model);
      } else {
        // If not, create it
        return Model.define(Model.attributes, function() {
          return cb(Model);
        });
      }
    });
  });
}

Migrator.migrate = function(config, done) {

  // Schema table exists?
  createSchemaTable(function(schemaModel) {
    // Retrieve rows in schemaModel

    // Load file names in db/migrate

    // Iterate through both and ensure matching, to find "current" version

    // Switch based on up/down

    //// If up, run future migrations in order

    //// Add row to schema table

    //// If down, run current down migration

    //// Remove row from schema table

    done();
  });

};

module.exports = Migrator;