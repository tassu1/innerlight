import React from 'react';
import '../Styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo">
          <h2>InnerLight</h2>
          <p>Shining a light on mental wellness.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li>About </li>
            <li>Journal</li>
            <li>Community</li>
          </ul>
        </div>

        {/* Support / Resources */}
        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li>FAQ</li>
            <li>Self-Help Library</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} InnerLight. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
