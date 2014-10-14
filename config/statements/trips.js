// jshint esnext:true
(function() {
	'use strict';

  var statements = {

    // get all trips
    all: {
      name: 'allTrips',
      text: 'SELECT trip_id AS id, user_id AS user, start_ts AS start, stop_ts AS stop, name AS comment FROM trip ORDER BY trip_id DESC'
    },

    // $1: username
    // get all trips for $1
    user: {
      name: 'userTrips',
      text: 'SELECT trip_id AS id, user_id AS user, start_ts AS start, stop_ts AS stop, name AS comment FROM trip WHERE user_id = $1 ORDER BY trip_id DESC'
    },

    // insert a new trip into the trip table
    insert: {
      name: 'insertTrip',
      text: 'INSERT INTO trip (trip_id, user_id, start_ts, expires, deleted) VALUES (DEFAULT, $1, $2, $3, false) RETURNING trip_id'
    },

    // finalize the inserted trip by updating stop_ts
    finalize: {
      name: 'finalizeTrip',
      text: 'UPDATE trip SET stop_ts = $1 WHERE trip_id = $2'
    },

    // create the trip table
    createTable: {
      name: 'createTripTable',
      text: 'CREATE TABLE IF NOT EXISTS trip (trip_id SERIAL PRIMARY KEY, user_id VARCHAR(36), start_ts BIGINT, stop_ts BIGINT, name VARCHAR(255), expires BIGINT, deleted BOOLEAN)',
    },

    // $1: trip_id
    delete: {
      name: 'deleteTrip',
      text: 'UPDATE trip SET deleted = true WHERE trip_id = $1'
    },

    // $1: trip_id
    undelete: {
      name: 'undeleteTrip',
      text: 'UPDATE trip SET deleted = false WHERE trip_id = $1'
    },

    // $1: trip_id
    // $1: data fields
    update: {
      name: 'updateTrip',
      text: 'UPDATE trip SET $2 WHERE trip_id = $1'
    }
  };

  module.exports = function (app) {
    return { trips: statements };
  };

}());