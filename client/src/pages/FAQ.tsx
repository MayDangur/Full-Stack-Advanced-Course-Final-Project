import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What can I do with TaxWise Israel?",
    answer:
      "TaxWise Israel allows you to manage your tax requests, upload and organize documents, and keep your tax-related information together in your personal area.",
  },
  {
    question: "Do I need an account to use the personal area?",
    answer:
      "Yes. You need to register or sign in before accessing your personal area. This helps keep your requests and documents associated with your account.",
  },
  {
    question: "How do I create a new tax request?",
    answer:
      "After signing in, open your Personal Area and select Create New Request. Enter the required information and submit the form. Your request will then appear in your request list.",
  },
  {
    question: "Can I edit or delete a tax request?",
    answer:
      "Yes. Existing requests can be edited from your Personal Area. You can also delete a request after confirming the action.",
  },
  {
    question: "Can I upload documents to my requests?",
    answer:
      "Yes. TaxWise allows you to upload documents and manage them directly from the relevant tax request.",
  },
  {
    question: "Can I view or download an uploaded document?",
    answer:
      "Yes. Uploaded documents can be viewed or downloaded from your Personal Area.",
  },
  {
    question: "Can I change my profile image?",
    answer:
      "Yes. You can upload a profile image, replace your existing image, or remove it from your Personal Area.",
  },
  {
    question: "Can I sign in with Google?",
    answer:
      "Yes. TaxWise Israel supports Google sign-in in addition to regular email and password authentication.",
  },
];

function FAQ() {
  // Use the current authentication state to display the correct navigation
  const { user, logout } = useAuth();

  // Store the index of the currently opened FAQ item
  const [openIndex, setOpenIndex] =
    useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(
      openIndex === index ? null : index
    );
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          TaxWise Israel <span>📈</span>
        </Link>

        <div className="nav-controls">
          <Link to="/" className="btn-text">
            Home
          </Link>

          <Link
            to="/about"
            className="btn-text"
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/personal-area"
                className="btn-text"
              >
                Personal Area
              </Link>

              <Link
                to="/login"
                className="btn-filled"
                onClick={logout}
              >
                ↪ Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-text"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn-filled"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="faq-page" dir="ltr">
        {/* FAQ introduction */}
        <section className="faq-hero">
          <span className="about-label">
            FAQ
          </span>

          <h1>Frequently Asked Questions</h1>

          <p>
            Find quick answers about using TaxWise Israel,
            managing your requests and working with your
            documents.
          </p>
        </section>

        {/* Expandable FAQ questions */}
        <section className="faq-section">
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen =
                openIndex === index;

              return (
                <div
                  className={`faq-item ${
                    isOpen ? "faq-item-open" : ""
                  }`}
                  key={item.question}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() =>
                      toggleQuestion(index)
                    }
                    aria-expanded={isOpen}
                  >
                    <span>
                      {item.question}
                    </span>

                    <span
                      className={`faq-icon ${
                        isOpen
                          ? "faq-icon-open"
                          : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`faq-answer ${
                      isOpen
                        ? "faq-answer-open"
                        : ""
                    }`}
                  >
                    <div className="faq-answer-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="main-footer"
        dir="ltr"
      >
        <div className="footer-grid">
          <div className="f-col">
            <h4>Services</h4>

            <ul>
              <li>Tax Refunds</li>
              <li>Annual Tax Reports</li>
            </ul>
          </div>

          <div className="f-col">
            <h4>Contact Us</h4>

            <p>03-1234567</p>
            <p>Tel Aviv, Israel</p>
          </div>
        </div>

        <div className="footer-bottom">
          © TaxWise Israel 2026. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}

export default FAQ;