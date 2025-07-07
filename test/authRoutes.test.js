require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const server = require("../index"); 
const User = require("../models/User");

const { expect } = chai;
chai.use(chaiHttp);

describe("🚀 Auth Routes - Signup & Login", () => {
  // Clear test user before & after
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteOne({ email: "testuser@example.com" });
  });

  after(async () => {
    await User.deleteOne({ email: "testuser@example.com" });
    await mongoose.disconnect();
  });


  // Test: Signup
  it("✅ should signup a new user successfully", (done) => {
    chai
      .request(server)
      .post("/api/v1/signup")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        role: "Student",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("User Created Successfully");
        done();
      });
  });


  // Test: Signup with existing user
  it("❌ should not allow duplicate signup", (done) => {
    chai
      .request(server)
      .post("/api/v1/signup")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "password123",
        role: "Student",
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("User Already Exist");
        done();
      });
  });


  // Test: Login with correct credentials
  it("✅ should login user successfully", (done) => {
    chai
      .request(server)
      .post("/api/v1/login")
      .send({
        email: "testuser@example.com",
        password: "password123",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal("User Logged in Successfully");
        expect(res.body).to.have.property("token");
        expect(res.body).to.have.property("user");
        done();
      });
  });


  // Test: Login with wrong password
  it("❌ should not login user with wrong password", (done) => {
    chai
      .request(server)
      .post("/api/v1/login")
      .send({
        email: "testuser@example.com",
        password: "wrongpassword",
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("Password Incorrect");
        done();
      });
  });

  
  // Test: Login with unregistered email
  it("❌ should not login unregistered user", (done) => {
    chai
      .request(server)
      .post("/api/v1/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.success).to.be.false;
        expect(res.body.message).to.equal("User is not registered");
        done();
      });
  });
});

// module.exports = app; // 👈 This is important for test file