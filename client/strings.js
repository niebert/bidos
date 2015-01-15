(function() {
  'use strict';


  var religions = [{
    value: 0,
    text: 'keine'
  }, {
    value: 1,
    text: 'Christentum'
  }, {
    value: 2,
    text: 'Judentum'
  }, {
    value: 3,
    text: 'Islam'
  }, {
    value: 4,
    text: 'Andere'
  }];

  var sexes = [{
    value: 1,
    text: 'männlich'
  }, {
    value: 2,
    text: 'weiblich'
  }];

  var hands = [{
    value: 1,
    text: 'linkshändig'
  }, {
    value: 2,
    text: 'rechtshändig'
  }];

  var statuses = [{
    value: 0,
    text: 'normal'
  }, {
    value: 1,
    text: 'neu'
  }, {
    value: 2,
    text: 'deaktiviert'
  }];

  var roles = [{
    value: 0,
    text: 'Administrator'
  }, {
    value: 1,
    text: 'Praktiker'
  }, {
    value: 2,
    text: 'Wissenschaftler'
  }];

  var behaviour = {
    help: [{
      value: true,
      text: 'normal',
      description: 'wenn das Kind das Verhalten nur zeigt, wenn die Erzieherin / Lehrerin es dabei unterstützt.Dies ist z.B.der Fall, wenn das Kind erst aufgrund eines Tipps, eines Hin - weises von ihr das beschriebene Verhalten zeigt, das es ohne ihre Hilfe und Unterstützung vermutlich nicht gezeigt hätte. '
    }, {
      value: false,
      text: 'normal',
      description: 'wenn das Kind das beschriebene Verhalten spontan zeigt, ohne dass die Erziehe-rin/Lehrerin es dabei unterstützt. • wenn die Erzieherin/Lehrerin lediglich die Aufmerksamkeit des Kindes lenkt, je-doch keine Hilfestellung gibt, die sich auf das beschriebene Verhalten bezieht („schau mal“, „überleg noch mal“ etc.).'
    }],

    niveaus: [{
      value: 0,
      text: 'weniger entwickelt',
      description: 'Das Kind zeigt ein Verhalten, das weniger weit entwickelt ist, als das auf Niveau 1 beschriebene.'
    }, {
      value: 1,
      text: 'Niveau 1'
    }, {
      value: 2,
      text: 'Niveau 2'
    }, {
      value: 3,
      text: 'Niveau 3'
    }, {
      value: 4,
      text: 'weiter entwickelt',
      description: 'Das Kind zeigt ein Verhalten, das bereits weiter entwickelt ist als das in Niveau 3 beschriebene.'
    }]
  };


  module.exports = {
    statuses: statuses,
    behaviour: behaviour,
    roles: roles,
    sexes: sexes,
    hands: hands,
    religions: religions
  };

}());
