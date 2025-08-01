import React, { useEffect } from "react";
import "../Styles/Home.css";
import Footer from "../components/Footer";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const left = document.querySelector(".mission-left");
    const right = document.querySelector(".mission-right");

    left.classList.add("slide-in-left");
    right.classList.add("slide-in-right");
  }, []);

  return (
    <>
      <div className="hero">
        <img src="home2.jpeg" alt="Hero" className="hero-image" />
        <div className="hero-text">
          <h1>Welcome to InnerLight</h1>
          <p>Your journey to mental wellness begins here.</p>
          <button className="hero-btn" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        </div>
      </div>

      <section className="mission">
        <div className="mission-left">
          <img src="hands.jpg" alt="Our Mission" />
        </div>
        <div className="mission-right">
          <h2>Our Mission</h2>
          <p>
            At InnerLight, we strive to create a safe and supportive space
            for everyone. Whether you're dealing with stress, anxiety, or just
            need someone to talk to, we're here for you.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
