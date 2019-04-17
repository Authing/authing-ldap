var ldap = require('ldapjs');

var client = ldap.createClient({
  // url: 'ldap://127.0.0.1:1389'
  url: 'ldap://ldap.forumsys.com'
});

// console.log(client);

client.bind('cn=read-only-admin,dc=example,dc=com', 'password', function(err) {
  // assert.ifError(err);
  if(err) {
    console.log(err);
  }
});

var opts = {
  // filter: '(cn=root)',
  scope: 'sub',
  attributes: ['dn', 'sn', 'cn', 'uid', 'gid', 'password', 'homedirectory', 'shell']
};

client.search('uid=tesla,dc=example,dc=com', opts, function(err, res) {
  const users = [];

  if (err) {
    console.log('error', err);
  }

  res.on('searchEntry', function(entry) {
    users.push(entry.object);
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {

    console.log(users[0]);

    console.log(users);

    if (users.length > 0) {
      client.bind(users[0].dn, 'password', e => {
        if (e) {
          let msg = {
            type: false,
            message: `用户名或密码不正确: ${e}`
          };
          // reject(msg);
          console.log(msg);
        } else {
          let msg = {
            type: true,
            message: `验证成功`,
            info: users[0]
          };
          // resolve(msg);
          console.log(msg);
        }
        client.unbind();
      });
    }

  });
});