var Waterline = require('waterline');
var _ = require('lodash');

var Migrator = {};
var MIGRATIONS_TABLE_NAME = 'schema_migrations';
var MIGRATIONS_ADAPTER_NAME = 'migrate-postgres';

var SchemaMigrationDefinition = {
  identity: MIGRATIONS_TABLE_NAME,
  connection: MIGRATIONS_ADAPTER_NAME,

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
};

function loadWaterline(adapter, cb) {
  var waterline = new Waterline();
  waterline.loadCollection(Waterline.Collection.extend(SchemaMigrationDefinition));

  waterline.initialize({
    adapters: {
      'sails-postgresql': adapter
    },
    connections: {
      'migrate-postgres': adapter.config
    },
    defaults: {
      connection: MIGRATIONS_ADAPTER_NAME
    }
  }, function(err, ontology) {
    if (err) return cb(err);

    cb(null, ontology.collections[MIGRATIONS_TABLE_NAME].adapter);
  });
}

function createMigrationsTableIfNeeded(tableAdapter, cb) {
  // Check if table exists
  tableAdapter.describe(function(err, existingAttributes) {
    if (err) return cb(err);
    
    // Return if it already exists
    if (existingAttributes) return cb();

    console.log('schema_migrations table does not exist, so let\'s create it...');
    tableAdapter.define(function(err) {
      if (err) return cb(err);

      console.log('schema_migrations table created.');
      cb();
    });
  });
}

Migrator.migrate = function(config, action, done) {

  loadWaterline(config.adapter, function(err, schemaMigrationsTable) {
    if (err) return done(err);

    createMigrationsTableIfNeeded(schemaMigrationsTable, function(err) {
      if (err) return done(err);
      
      schemaMigrationsTable.find({}, function(err, rows) {
        var dbVersions = _.map(rows, function(row) {
          return row.version;
        })
        dbVersions.sort();
        console.log(dbVersions);

        done();
      });
    });

      // Retrieve rows in schemaModel

      // Load file names in db/migrate

      // Iterate through both and ensure matching, to find "current" version

      // Switch based on up/down

      //// If up, run future migrations in order

      //// Add row to schema table

      //// If down, run current down migration

      //// Remove row from schema table

    // });
  });

};

module.exports = Migrator;