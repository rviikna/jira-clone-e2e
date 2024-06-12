describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });

  const issueCommentsSelector = '[data-testid="issue-comment"]';
  const commentPlaceholderSelector = 'textarea[placeholder="Add a comment..."]';

  function addComment(newComment) {
    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get(commentPlaceholderSelector).type(newComment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get(issueCommentsSelector).should("contain", newComment);
    });
  }

  function editComment(originalComment, editedComment) {
    getIssueDetailsModal().within(() => {
      cy.get(issueCommentsSelector)
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get(commentPlaceholderSelector)
        .should("contain", originalComment)
        .clear()
        .type(editedComment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get(issueCommentsSelector)
        .should("contain", "Edit")
        .and("contain", editedComment);
    });
  }

  function removeComment(comment) {
    getIssueDetailsModal()
      .find(issueCommentsSelector)
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find(issueCommentsSelector)
      .should("not.contain", comment);
  }

  it.only("Should add, edit and remove comment successfully", () => {
    const comment = "my comment";
    const editedComment = "my comment edited";
    addComment(comment);
    editComment(comment, editedComment);
    removeComment(editedComment);
  });
});
