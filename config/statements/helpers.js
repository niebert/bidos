(function() {
	'use strict';

  var statements = {

    tables: {
      name: 'allTables',
      text: "SELECT array(SELECT c.relname FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r','') AND n.nspname <> 'pg_catalog'AND n.nspname <> 'information_schema'AND n.nspname !~ '^pg_toast'AND pg_catalog.pg_get_userbyid(c.relowner) != 'postgres' AND pg_catalog.pg_table_is_visible(c.oid) ORDER BY 1) as tables"
    },

    sensorTables: {
      name: 'sensorTables',
      text: 'SELECT table_name FROM information_schema.columns WHERE column_name = \'ts\''
    },

    columns: function(tableName) {
      return {
        name: 'tableColumns',
        text: "SELECT attname FROM pg_attribute WHERE attrelid = 'public." + tableName + "'::regclass AND attnum > 0 AND NOT attisdropped ORDER BY attnum"
      };
    },

    // $1: trip_id
    // $2: table
    count: {
      name: 'count',
      text: 'SELECT (SELECT COUNT(ts) FROM $2 WHERE trip_id = $1) AS $2'
    }

  };

  module.exports = function (app) {
    return { helpers: statements };
  };

}());