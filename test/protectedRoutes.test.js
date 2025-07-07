const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const jwt = require("jsonwebtoken");
require("dotenv").config();

chai.use(chaiHttp);
const expect = chai.expect;

describe("🛡️ Protected Routes Tests", () => {
  let studentToken;
  let adminToken;

  before(() => {
    // Generate JWT tokens for testing
    studentToken = jwt.sign(
      {
        email: "student@example.com",
        _id: "student123",
        role: "Student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    adminToken = jwt.sign(
      {
        email: "admin@example.com",
        _id: "admin123",
        role: "Admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
  });


  // -----------------------
  it("✅ should access /test route with valid token", (done) => {
    chai
      .request(app)
      .get("/api/v1/test")
      .set("Authorization", `Bearer ${studentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "Welcome to Protected Route for test"
        );
        done();
      });
  });


  // -----------------------
  it("✅ should access /student route with student token", (done) => {
    chai
      .request(app)
      .get("/api/v1/student")
      .set("Authorization", `Bearer ${studentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "Welcome to Protected Route for Students"
        );
        done();
      });
  });

  // -----------------------
  it("❌ should NOT access /student route with admin token", (done) => {
    chai
      .request(app)
      .get("/api/v1/student")
      .set("Authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal(
          "This is a Protected Route for students"
        );
        done();
      });
  });

  
  // -----------------------
  it("✅ should access /admin route with admin token", (done) => {
    chai
      .request(app)
      .get("/api/v1/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(
          "Welcome to Protected Route for Admin"
        );
        done();
      });
  });

  // -----------------------
  it("❌ should NOT access /admin route with student token", (done) => {
    chai
      .request(app)
      .get("/api/v1/admin")
      .set("Authorization", `Bearer ${studentToken}`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal(
          "This is a Protected Route for Admin"
        );
        done();
      });
  });
});
