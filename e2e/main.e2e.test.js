describe('E2E testing', () => {
  it('Visit a home page.', () => {
    cy.visit('http://localhost:3000');
    cy.contains('h1', 'Hello world!');
    cy.contains('footer', 'Copyright');
    cy.title().should('eq', 'hack-it-up.ru — Главная');
  });
});
