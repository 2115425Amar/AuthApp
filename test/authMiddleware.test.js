const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

const { expect } = chai;
chai.use(chaiHttp);

describe(" Middleware - Auth Tests", () => {
  const dummyUser = {
    email: "test@example.com",
    _id: "abc123",
    role: "Student"
  };

  const token = jwt.sign(dummyUser, process.env.JWT_SECRET, { expiresIn: "1h" });

  it("✅ should call next() when valid token is provided in cookie", (done) => {
    const req = {
      cookies: { token },
      body: {},
      header: () => null,
    };
    const res = {};
    const next = () => {
      expect(req).to.have.property("user");
      expect(req.user.email).to.equal(dummyUser.email);
      done();
    };

    auth(req, res, next);
  });


  it("❌ should return 401 if token is missing", (done) => {
    const req = {
      cookies: {},
      body: {},
      header: () => null,
    };
    const res = {
      status: function(code) {
        expect(code).to.equal(401);
        return this;
      },
      json: function(data) {
        expect(data.success).to.be.false;
        expect(data.message).to.equal("Token Missing");
        done();
      }
    };
    auth(req, res, () => {});
  });
  

  it("❌ should return 401 if token is invalid", (done) => {
    const req = {
      cookies: { token: "invalidtoken" },
      body: {},
      header: () => null,
    };
    const res = {
      status: function(code) {
        expect(code).to.equal(401);
        return this;
      },
      json: function(data) {
        expect(data.success).to.be.false;
        expect(data.message).to.equal("Token is Invalid");
        done();
      }
    };
    auth(req, res, () => {});
  });
});
