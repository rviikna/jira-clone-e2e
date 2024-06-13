import { faker } from "@faker-js/faker";

const issueModal = '[data-testid="modal:issue-create"]';
const descriptionSelector = ".ql-editor";
const titleSelector = 'input[name="title"]';
const submitButton = 'button[type="submit"]';
const issueDetailsModal = '[data-testid="modal:issue-details"]';
const issueCreatedConfirmation = "Issue has been successfully created.";
const backLogList = '[data-testid="board-list:backlog"]';
const numberSelector = 'input[placeholder="Number"]';
const timeTrackingStopwatch = '[data-testid="icon:stopwatch"]';
const noTimeLogged = "No time logged";
const timeTrackingModal = '[data-testid="modal:tracking"]';

const testData = {
  timeEstimate: "10",
  updatedTimeEstimate: "20",
  timeSpent: "2",
  timeRemaining: "5",
};

const issueDetails = {
  title: faker.lorem.words(2),
  description: faker.lorem.words(5),
};

function createIssue(issueDetails) {
  cy.get(issueModal).within(() => {
    cy.get(descriptionSelector).type(issueDetails.description);
    cy.get(titleSelector).type(issueDetails.title);
    cy.get(submitButton).click();
  });
  cy.contains(issueCreatedConfirmation).should("be.visible");
  cy.get(backLogList).should("be.visible").contains(issueDetails.title).click();
}

function addEstimation() {
  cy.get(numberSelector)
    .clear()
    .type(testData.timeEstimate)
    .should("have.value", testData.timeEstimate);
  cy.get(timeTrackingStopwatch).next().should("contain", testData.timeEstimate);
}

function updateEstimation() {
  cy.get(numberSelector)
    .clear()
    .type(testData.updatedTimeEstimate)
    .should("have.value", testData.updatedTimeEstimate);
  cy.get(timeTrackingStopwatch)
    .next()
    .should("contain", testData.updatedTimeEstimate);
}

function removeEstimation() {
  cy.get(numberSelector).click().clear();
  cy.contains(noTimeLogged).should("be.visible");
}

function logTime() {
  cy.get(timeTrackingStopwatch).click();
  cy.get(timeTrackingModal).should("be.visible");

  cy.get(timeTrackingModal).within(() => {
    cy.get(numberSelector).eq(0).clear().type(testData.timeSpent);
    cy.get(numberSelector).eq(1).clear().type(testData.timeRemaining);
  });
  cy.contains("button", "Done").click();
  cy.get(timeTrackingModal).should("not.exist");

  cy.get(issueDetailsModal).within(() => {
    cy.get(timeTrackingStopwatch)
      .next()
      .should("not.contain", "No time logged")
      .should("contain", testData.timeSpent)
      .and("contain", testData.timeRemaining);
  });
}

function removeLoggedTime() {
  cy.get(timeTrackingStopwatch).click();
  cy.get(timeTrackingModal).should("be.visible");

  cy.get(timeTrackingModal).within(() => {
    cy.get(numberSelector).eq(0).clear();
    cy.get(numberSelector).eq(1).clear();
  });

  cy.get(timeTrackingModal).within(() => {
    cy.contains("button", "Done").click();
  });

  cy.get(timeTrackingModal).should("not.exist");

  cy.get(issueDetailsModal).within(() => {
    cy.get(timeTrackingStopwatch)
      .next()
      .should("not.contain", "remaining")
      .should("contain", "No time logged");
  });
}

describe("Time tracking function", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
    createIssue(issueDetails);
  });

  it("Should add, edit, and remove time estimation", () => {
    addEstimation();
    updateEstimation();
    removeEstimation();
  });

  it("should log time and remove logged time successfully", () => {
    logTime();
    removeLoggedTime();
  });
});
