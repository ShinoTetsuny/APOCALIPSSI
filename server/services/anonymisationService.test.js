const { anonymiserNom, anonymiserEmail } = require('./anonymisationService');

describe('anonymisationService', () => {
  it('anonymiserNom doit retourner un nom anonymisé', () => {
    const result = anonymiserNom('Jean', '1234567890ab');
    expect(result).toMatch(/^anonymous_\w{6}$/);
  });

  it('anonymiserEmail doit retourner un email anonymisé', () => {
    const result = anonymiserEmail('jean@example.com', 'abcdef123456');
    expect(result).toMatch(/^anonymous_\w{6}@example\.com$/);
  });

  it('anonymiserNom doit fonctionner sans id', () => {
    const result = anonymiserNom('Jean');
    expect(result).toMatch(/^anonymous_\w+$/);
  });

  it('anonymiserEmail doit fonctionner sans id', () => {
    const result = anonymiserEmail('jean@example.com');
    expect(result).toMatch(/^anonymous_\w+@example\.com$/);
  });
});
