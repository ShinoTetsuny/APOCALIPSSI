function anonymiserNom(nom, id = '') {
  return 'anonymous_' + (id ? id.toString().slice(-6) : Math.random().toString(36).substring(2, 8));
}

function anonymiserEmail(email, id = '') {
  return 'anonymous_' + (id ? id.toString().slice(-6) : Math.random().toString(36).substring(2, 8)) + '@example.com';
}

module.exports = {
  anonymiserNom,
  anonymiserEmail,
};
