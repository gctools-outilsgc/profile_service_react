const url = window.location.origin;

module.exports = {
  authority: 'https://dev.account.gccollab.ca/openid',
  client_id: '738632',
  client_secret:
  'd3141d5522b62b37ab1af4eb4d8ba61988c8d68cdd07bb27a7fc56cd',
  scope: 'openid modify_profile email profile',
  post_logout_redirect_uri: `${url}/#!logout`,
  redirect_uri: `${url}/#!callback`,
  silent_redirect_uri: `${url}/#!silent`,
};

console.log('DEV');
console.log(url);
