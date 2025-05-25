import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <Header />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-5">
                <h1 className="mb-4 text-primary fw-bold">About Online Learning System</h1>
                <p className="lead mb-4">
                  Welcome to <strong>Online Learning System (OLS)</strong> – your trusted platform for learning programming and technology skills from anywhere, at any time.
                </p>
                <h4 className="fw-semibold mb-3">Our Mission</h4>
                <p>
                  OLS is dedicated to making high-quality programming education accessible to everyone. We connect passionate instructors with eager learners, providing a modern, interactive, and flexible online learning experience.
                </p>
                <h4 className="fw-semibold mb-3">What We Offer</h4>
                <ul>
                  <li>Hundreds of programming courses in languages like Python, JavaScript, Java, C#, and more.</li>
                  <li>Project-based learning, quizzes, and real-world assignments.</li>
                  <li>Expert instructors with years of industry experience.</li>
                  <li>Lifetime access to purchased courses and learning materials.</li>
                  <li>Personalized learning paths and progress tracking.</li>
                  <li>Active community support and Q&A forums.</li>
                </ul>
                <h4 className="fw-semibold mb-3">Why Choose OLS?</h4>
                <ul>
                  <li>Flexible learning: Study at your own pace, on any device.</li>
                  <li>Affordable pricing and frequent discounts.</li>
                  <li>Certificate of completion for every course.</li>
                  <li>Secure payment and privacy protection.</li>
                </ul>
                <h4 className="fw-semibold mb-3">Contact Us</h4>
                <p>
                  Have questions or need support? Reach out to our team at <a href="mailto:support@ols.com">support@ols.com</a> or visit our <a href="/support">Support</a> page.
                </p>
                <p className="mt-4 text-muted">
                  &copy; {new Date().getFullYear()} Online Learning System. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
