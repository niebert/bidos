module.exports = {

  // colors
  // http://codepen.io/benknight/full/nADpy/
  // https://color.adobe.com/explore/most-popular/?time=all
  colors: {
    firenze: ['#337754', '#ffed94', '#ffa029', '#ac3619', '#7f1b00'],
    phaedra: ['#ff4a25', '#ffff8b', '#b0e88e', '#63b17d', '#009376'],
    custom1: ['#f7c6ff', '#fff7b4', '#3a90ff', '#ffc9af', '#c8ffd6'],
    obs: ['#52968d', '#efdc9d', '#ec6d58', '#f54337', '#c71b16'], // pomegranate explosion
    bidos: ['#b72926', '#de9624', '#5f539f', '#4b7fa2'] // copied from pdf
  },

  // capture steps
  steps: ['kid', 'domain', 'subdomain', 'item', 'behaviour', 'help', 'examples', 'ideas', 'review'],

  // kids keys
  religions: [{
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
  }],

  // kids sexes
  sexes: [{
    value: 1,
    text: 'männlich'
  }, {
    value: 2,
    text: 'weiblich'
  }],

  // kids hands
  hands: [{
    value: 1,
    text: 'linkshändig'
  }, {
    value: 2,
    text: 'rechtshändig'
  }],

  // user statuses
  statuses: [{
    value: 0,
    text: 'normal'
  }, {
    value: 1,
    text: 'neu'
  }, {
    value: 2,
    text: 'deaktiviert'
  }],

  // user roles
  roles: [{
    value: 0,
    text: 'Administrator'
  }, {
    value: 1,
    text: 'Praktiker'
  }, {
    value: 2,
    text: 'Wissenschaftler'
  }],

  // behaviour help text TODO REMOVE(?)
  behaviour: {
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
  }
};
