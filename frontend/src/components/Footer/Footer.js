import React from 'react';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import appleImage from '../../assets/apple.jpeg'; // Ensure this path is correct
import googleImage from '../../assets/google.png'; // Ensure this path is correct
import './Footer.css';

export default function Footer() {
  return (
    <div className='foo'>
        
        <footer className="footer">
            <div className='fooin'>
      <section className="social-section">
        <div className="social-text">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="social-icons">
          <a href="#" className="social-link"><FaFacebookF /></a>
          <a href="#" className="social-link"><FaTwitter /></a>
          <a href="#" className="social-link"><FaGoogle /></a>
          <a href="#" className="social-link"><FaInstagram /></a>
          <a href="#" className="social-link"><FaLinkedin /></a>
          <a href="#" className="social-link"><FaGithub /></a>
        </div>
      </section>

      <section className="footer-content">
        <div className="footer-container">
          <div className="footer-col">
            <h6 className="footer-heading1">giTogether</h6>
            <p>
              giTogether is your ultimate platform for connecting, collaborating, and innovating with fellow developers.
            </p>
          </div>

          <div className="footer-col">
            <h6 className="footer-heading">Products</h6>
            <p><a href="#!" className="footer-link">Angular</a></p>
            <p><a href="#!" className="footer-link">React</a></p>
            <p><a href="#!" className="footer-link">Vue</a></p>
            <p><a href="#!" className="footer-link">Laravel</a></p>
          </div>

          <div className="footer-col">
            <h6 className="footer-heading">Useful links</h6>
            <p><a href="#!" className="footer-link">Pricing</a></p>
            <p><a href="#!" className="footer-link">Settings</a></p>
            <p><a href="#!" className="footer-link">Orders</a></p>
            <p><a href="#!" className="footer-link">Help</a></p>
          </div>

          <div className="footer-col">
            <h6 className="footer-heading">Contact</h6>
            <p>New York, NY 10012, US</p>
            <p>info@example.com</p>
            <p>+ 01 234 567 88</p>
            <p>+ 01 234 567 89</p>
          </div>
        </div>
      </section>

      <section className="get-app-section">
        <h2>Get the app!</h2>
        <div className="app-buttons">
          <div className="app-download">
            <img src={appleImage} alt="Download on the App Store" className="app-image" />
          </div>
          <div className="app-download">
            <img src={googleImage} alt="Get it on Google Play" className="app-image" />
          </div>
        </div>
        <p className="app-description">
          <strong>Welcome to giTogether!</strong><br />
          Think of it as "Tinder for Developers" a platform where you can connect, collaborate, and create new projects with like-minded developers. Whether you're a coding beginner or a seasoned pro, geTogether helps you find the right people to work with and take your skills to the next level. Create meaningful connections, start new projects, and share your coding journey with a community of developers who are just as passionate as you are!<br /><br />
          geTogether makes it easy to collaborate on exciting new projects, share your ideas, and get feedback from others in the developer community. Whether you're looking to work on open-source projects, find coding partners, or just chat with other developers, this is the platform for you. The app is designed to help developers of all skill levels come together and push their limits while making new friends and learning from each other. Download now and join the revolution of collaborative development!
        </p>
      </section>

      <section className="footer-bottom">
        <p>&copy; 2024 geTogether. All Rights Reserved. <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
      </section>
      </div>
    </footer>
    </div>
    
  );
}
