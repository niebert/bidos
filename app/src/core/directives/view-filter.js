function viewFilter(query) {
    if (!query) {
      return;
    }

    // NOTE: cleared input/select fields set null value to bound variable

    return function(query, i, resource) {
      var a = [];
      // FIXME
      // if (query.hasOwnProperty('name') && query.name !== null) {
      //   var re = new RegExp('\\b' + query.name, 'i'); // leading word delimiter
      //   a.push(resource.name.match(re));
      // }

      // if (query.hasOwnProperty('institution_id') && query.institution_id !== null) {
      //   a.push(resource.id === query.institution_id);
      // }

      // // 0 == male; 1 == female
      // if (query.hasOwnProperty('resourceSex') && query.resourceSex !== null) {
      //   a.push(resource.sex === query.kidSex);
      // }

      return _.all(a);
    };
  }

module.exports = viewFilter;
