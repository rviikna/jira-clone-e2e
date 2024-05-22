class Wine {
  constructor() {
    this.age = "1889";
    this.type = "red-dry";
  }

  drink() {
    cy.get("#wine").click();
  }
}
