var debug = require('debug')('leader:fullcontact:name');
var extend = require('extend');
var objCase = require('obj-case');
var Fullcontact = require('fullcontact');


/**
 * Create a new leader plugin.
 *
 * @params {String} apiKey
 * @returns {Object}
 */

module.exports = function (apiKey) {
  return { fn: middleware(apiKey), wait: wait, test: {accurate: accurate} };
};

/**
 * Create a Fullcontact name API leader plugin.
 *
 * @return {String} apiKey
 * @return {Function}
 */

function middleware (apiKey) {
  var fullcontact = new Fullcontact(apiKey);
  return function fullcontactNameApi (person, context, next) {
    // search for both email and username. go with higher probablity
    var username = getUsername(person, context);
    if (!username) return next();
    debug('querying fullcontact with username %s ..', username);
    fullcontact.name.deducer({ username: username }, function (err, data) {
      console.log(err);
      if (err) return next();
      extend(true, context, {fullcontact: {name: data}});
      if (accurate(data, username)) {
        details(data.nameDetails, person);
        debug('Got Fullcontact name for username %s', username);
      }
      next();
    });
  };
}

/**
 * Copy the crunchbase company `profile` details to the `person.company`.
 *
 * @param {Object} profile
 * @param {Object} person
 */

function details (name, person) {
  person.name = name.fullName;
  person.firstName = name.givenName;
  person.lastName = name.familyName;
}

/**
 * Sanity check the name accuracy
 *
 * @param {Object} profile
 * @param {String} username
 */

function accurate (data, username) {
  return data.likelihood > 0.5;
  // TODO(ted) - consider using levenstein filter
  // as a lowpass filter on each name to enser the overlap
  // between lastName || firstName and the source username
  // is still high.  I think gwintrob getting split into
  // gwin trob is unlikely for email even if it has a greater
  // probability than firstName = g, lastName = wintrob. 
  // leventhstein distance would compute higher for wintrob
  // on gwintrob than for either gwin or trob. 
}

/**
 * Wait until we have an interesting username available.
 * But don't run if we have a name from some other source.
 * TODO(ted) - update this when person fields get
 * probabilities associated with them.
 *
 * @param {Object} context
 * @param {Object} person
 * @return {Boolean}
 */

function wait (person, context) {
  return !person.name && getUsername(person, context);
}

/**
 * Get the username to search for
 *
 * @param {Object} context
 * @param {Object} person
 * @return {String}
 */

function getUsername (person, context) {
  var username;
  if (person.email) {
    username = person.email.split('@')[0];
  }
  // TODO(Ted) - consider parsing other userIds we may have
  // available - e.g. twitter handle.
  return username;
}