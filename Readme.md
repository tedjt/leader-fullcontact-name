
# leader-fullcontact-name

  A [leader](https://github.com/ivolo/leader) plugin for the [Fullcontact](https://fullcontact.com/) name API. Get a Fullcontact API key [here](http://developer.fullcontact.com/).

## Example

```js
var Leader = require('leader');
var FullcontactName = require('leader-fullcontact-name');

var leader = Leader()
  .use(FullcontactName('FULLCONTACT_API_KEY'))
  .populate({ email: 'ted.j.tomlinson@gmail.com'}, function(err, person) {
    // ..
});
```

It will search Fullcontact using the SS census data to return the most probable name match for the given email address or username (with domain stripped on email address)

And it will add the following to the `person`:

```js
{
  // ..
  name: 'Ted Tomlinson',
  firstName: 'Ted',
  lastName: 'Tomlinson'
}
```

## API

#### FullcontactName(apiKey)

  Return a Leader plugin for the Fullcontact name API.
