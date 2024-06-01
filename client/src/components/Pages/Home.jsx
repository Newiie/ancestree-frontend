import React from 'react';
import '../Pages/Home.css';
import Nav_Home from '../NavBar/Nav_Home';
//asset imports
import bgHome from '../../pageAssets/backgroundHome.mp4';
import {} from 'react-icons'
import {} from 'lucide-react'

const Home = () => {
    const handleGetStartedClick = () => {
        document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div><Nav_Home/>
            <div className='homePage'>
                <video src={bgHome} autoPlay muted loop></video>
                <div className="contentContainer">
                    <h1>Welcome to AncesTREE</h1>
                    <p>Unraveling Ancestral Lineages through Geographical History</p>
                    <button onClick={handleGetStartedClick}>GET STARTED</button>
                </div>
                <div id="mainContent" className="mainContent">
                    {/* Search Family Section */}
                    <section className="searchFamily">
                        <h2>Search Family</h2>
                        <p>Discover your roots and explore your family history through our comprehensive search tools.</p>
                        <input type="text" placeholder="Enter family name or ancestor" />
                        <button>Search</button>
                    </section>

                    {/* About Section */}
                    <section className="about">
                        <h2>About Us</h2>
                        <p>At AncesTREE, we are dedicated to helping you uncover the stories of your ancestors. Our mission is to provide you with the tools and resources to explore your family history and connect with your heritage.</p>
                        <div className="mission">
                            <h3>Our Mission</h3>
                            <p>Our mission is to bridge the past with the present, providing a window into the lives of our forebears.</p>
                        </div>
                        <div className="team">
                            <h3>Meet the Team</h3>
                            <p>We are a group of passionate genealogists and historians committed to making family history accessible to everyone.</p>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="services">
                        <h2>Our Services</h2>
                        <ul>
                            <li>
                                <h3>Genealogy Research</h3>
                                <p>Professional research services to trace your family history and uncover your lineage.</p>
                            </li>
                            <li>
                                <h3>Historical Records</h3>
                                <p>Access to a vast database of historical records, including birth, marriage, and death certificates.</p>
                            </li>
                            <li>
                                <h3>DNA Testing</h3>
                                <p>State-of-the-art DNA testing services to help you connect with relatives and understand your genetic heritage.</p>
                            </li>
                        </ul>
                    </section>

                    {/* Testimonials Section */}
                    <section className="testimonials">
                        <h2>Testimonials</h2>
                        <p>See what our satisfied customers have to say about AncesTREE.</p>
                        <div className="testimonial">
                            <p>"AncesTREE helped me discover relatives I never knew I had. Their services are truly remarkable!" - Jane Doe</p>
                        </div>
                        <div className="testimonial">
                            <p>"I was able to trace my family history back to the 1600s. AncesTREE's resources are unparalleled." - John Smith</p>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="contact">
                        <h2>Contact Us</h2>
                        <p>If you have any questions or need assistance, feel free to reach out to us. We are here to help you on your journey of discovery.</p>
                        <form>
                            <input type="text" placeholder="Your Name" />
                            <input type="email" placeholder="Your Email" />
                            <textarea placeholder="Your Message"></textarea>
                            <button type="submit">Send Message</button>
                        </form>
                    </section>

                    
                </div>

                {/* Footer Section */}
                <footer className="footer">
                        <p>© 2024 AncesTREE. All rights reserved.</p>
            
                        <div className="socialMedia">
                            <a href="#">

                            </a>
                            <a href="#">Twitter</a>
                            <a href="#">Instagram</a>
                        </div>
                    </footer>
            </div>
        </div>
    );
}

export default Home;
