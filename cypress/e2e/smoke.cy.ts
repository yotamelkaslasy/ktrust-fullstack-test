import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to signup", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/signup");

    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");

    // cy.get('input[name="email"]').type(loginForm.email);
    // cy.get('input[name="password"]').type(loginForm.password);

    // cy.get('button[type="submit"]').click();
  });

  it("should allow you to login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };

    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/login");

    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="password"]').should("exist");
    cy.get('button[type="submit"]').should("exist");

    // cy.get('input[name="email"]').type(loginForm.email);
    // cy.get('input[name="password"]').type(loginForm.password);

    // cy.get('button[type="submit"]').click();
  });
});
