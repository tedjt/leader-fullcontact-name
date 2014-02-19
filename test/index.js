
var assert = require('assert');
var should = require('should');
var plugin = require('..');

describe('leader-fullcontact-name', function () {

  var fullcontactName = plugin('997a4791ff2b8690');

  it('should wait if theres no email', function () {
    var context = {}, person = {};
    assert(!fullcontactName.wait(person, context));
  });

  it('should not wait if there is a company name', function () {
    var person = { email: 'ted.j.tomlinson@gmail.com'};
    var context = {};
    assert(fullcontactName.wait(person, context));
  });

  it('should pass accuracy if the name is > 0.5', function () {
    var data = {likelihood: 0.8};
    assert(fullcontactName.test.accurate(data, 'randomUserName'));
  });

  it('should fail accuracy if the name is < 0.5', function () {
    var data = {likelihood: 0.3};
    assert(!fullcontactName.test.accurate(data, 'randomUserName'));
  });

  it('should be able to resolve a valid fullcontact name', function (done) {
    var person = { email: 'ted.j.tomlinson@gmail.com' };
    var context = {};
    fullcontactName.fn(person, context, function (err) {
      if (err) return done(err);
      assert(person);
      console.log(person);
      person.name.should.equal('Ted J. Tomlinson');
      person.firstName.should.equal('Ted');
      person.lastName.should.equal('Tomlinson');
      done();
    });
  });
});
