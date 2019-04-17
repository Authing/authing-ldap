var ldap = require('ldapjs');

var client = ldap.createClient({
  url: 'ldap://127.0.0.1:1389'
});

// console.log(client);

client.bind('cn=root', 'secret', function(err) {
  // assert.ifError(err);
  if(err) {
    console.log(err);
    return;
  }
});

var opts = {
  filter: '(cn=root)',
  scope: 'sub',
  attributes: ['dn', 'sn', 'cn']
};

client.search('ou=users, o=myhost', opts, function(err, res) {
  if (err) {
    console.log(err);
  }

  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));

    console.log(entry.object);
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});