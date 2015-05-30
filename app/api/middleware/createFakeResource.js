'use strict';
var _ = require('lodash');
var faker = require('faker');
faker.locale = 'de';

// FIXME
String.prototype.capitalizeFirstvarter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function* createFakeResource() {
  var minAge = new Date(new Date().setDate(new Date().getDate() - 1 * 365 * 6));
  var maxAge = new Date(new Date().setDate(new Date().getDate() - 1 * 365 * 12));

  var resource = this.params.resource;

  switch (resource) {

    case 'institution':
      this.body = {
        type: resource,
        name: faker.company.companyName()
      };

      break;
    case 'group':

      var result =
        yield this.pg.db.client.query_(`SELECT id FROM institutions`);

      var institutionIds = _.map(result.rows, 'id');

      this.body = {
        type: resource,
        name: [faker.company.bsAdjective().capitalizeFirstvarter(), faker.company.bsNoun().capitalizeFirstvarter()].join(' '),
        institutionId: _.sample(institutionIds)
      };

      break;
    case 'kid':

      var groupResults =
        yield this.pg.db.client.query_(`SELECT id FROM institutions`);

      var groupIds = _.map(groupResults.rows, 'id');

      this.body = {
        type: resource,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        bday: faker.date.between(maxAge, minAge),
        sex: _.random(1, 3),
        hands: _.random(1, 3),
        religion: _.random(0, 9),
        groupId: _.sample(groupIds)
      };

      break;
    case 'observation':

      var itemResults =
        yield this.pg.db.client.query_(`SELECT id FROM items`);

      var itemIds = _.map(itemResults.rows, 'id');

      var kidResults =
        yield this.pg.db.client.query_(`SELECT id FROM kids`);

      var kidIds = _.map(kidResults.rows, 'id');

      this.body = {
        type: resource,
        itemId: _.sample(itemIds),
        kidId: _.sample(kidIds),
        niveau: _.random(0, 4),
        help: _.random(0, 1)
      };

      break;
    case 'user':

      var _groupResults =
        yield this.pg.db.client.query_(`SELECT id FROM groups`);

      var _groupIds = _.map(_groupResults.rows, 'id');

      this.body = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        groupId: _.sample(_groupIds),
        role: _.random(1, 3),
        email: `rene.wilhelm+${faker.lorem.words()[0]}@gmail.com`, // faker.internet.email().toLowerCase(),
        job: faker.lorem.words().join(' '),
        password: '123' // faker.internet.password()
      };

      console.log(this.body);

      break;
    default:
      this.body = {
        msg: 'Known resources: kid, group, institution'
      };
  }

  // request
  //   .post(`localhost:3002/v1/${this.params.resource}`)
  //   .send({
  //     name: 'Manny',
  //     species: 'cat'
  //   })
  //   .set('X-API-Key', 'foobar')
  //   .set('Accept', 'application/json')
  //   .end(function(err, res) {
  //     if (err) {
  //       this.log.error(err);
  //     } else {
  //       this.log.info(res);
  //     }
  //   }.bind(this));

}
function* createFakeResource() {
  var minAge = new Date(new Date().setDate(new Date().getDate() - 1 * 365 * 6));
  var maxAge = new Date(new Date().setDate(new Date().getDate() - 1 * 365 * 12));

  var resource = this.params.resource;

  switch (resource) {

    case 'institution':
      this.body = {
        type: resource,
        name: faker.company.companyName()
      };

      break;
    case 'group':

      var result =
        yield this.pg.db.client.query_(`SELECT id FROM institutions`);

      var institutionIds = _.map(result.rows, 'id');

      this.body = {
        type: resource,
        name: [faker.company.bsAdjective().capitalizeFirstvarter(), faker.company.bsNoun().capitalizeFirstvarter()].join(' '),
        institutionId: _.sample(institutionIds)
      };

      break;
    case 'kid':

      var groupResults =
        yield this.pg.db.client.query_(`SELECT id FROM institutions`);

      var groupIds = _.map(groupResults.rows, 'id');

      this.body = {
        type: resource,
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        bday: faker.date.between(maxAge, minAge),
        sex: _.random(1, 3),
        hands: _.random(1, 3),
        religion: _.random(0, 9),
        groupId: _.sample(groupIds)
      };

      break;
    case 'observation':

      var itemResults =
        yield this.pg.db.client.query_(`SELECT id FROM items`);

      var itemIds = _.map(itemResults.rows, 'id');

      var kidResults =
        yield this.pg.db.client.query_(`SELECT id FROM kids`);

      var kidIds = _.map(kidResults.rows, 'id');

      this.body = {
        type: resource,
        itemId: _.sample(itemIds),
        kidId: _.sample(kidIds),
        niveau: _.random(0, 4),
        help: _.random(0, 1)
      };

      break;
    case 'user':

      var _groupResults =
        yield this.pg.db.client.query_(`SELECT id FROM groups`);

      var _groupIds = _.map(_groupResults.rows, 'id');

      this.body = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        groupId: _.sample(_groupIds),
        role: _.random(1, 3),
        email: `rene.wilhelm+${faker.lorem.words()[0]}@gmail.com`, // faker.internet.email().toLowerCase(),
        job: faker.lorem.words().join(' '),
        password: '123' // faker.internet.password()
      };

      console.log(this.body);

      break;
    default:
      this.body = {
        msg: 'Known resources: kid, group, institution'
      };
  }

  // request
  //   .post(`localhost:3002/v1/${this.params.resource}`)
  //   .send({
  //     name: 'Manny',
  //     species: 'cat'
  //   })
  //   .set('X-API-Key', 'foobar')
  //   .set('Accept', 'application/json')
  //   .end(function(err, res) {
  //     if (err) {
  //       this.log.error(err);
  //     } else {
  //       this.log.info(res);
  //     }
  //   }.bind(this));

}

module.exports = createFakeResource;
