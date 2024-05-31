describe("Issue deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should delete an issue successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.get("button").contains("Delete issue").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.contains("This is an issue of type: Task.").should("not.exist");
  });

  it("Should initiate the issue deletion and then canceling it successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]').click();
    });
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.get("button").contains("Cancel").click();
    });
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="icon:close"]').eq(0).click();
    cy.contains("This is an issue of type: Task.").should("be.visible");
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
