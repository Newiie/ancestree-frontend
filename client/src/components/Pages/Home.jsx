


import React from 'react';
import '../Pages/Home.css';
import Nav_Home from '../NavBar/Nav_Home';

// asset imports
import bgHome from '../../pageAssets/backgroundHome.mp4';
import searchCard from '../../pageAssets/searchCard.mp4';
import recordCard from '../../pageAssets/recordCard.mp4';
import familyCard from '../../pageAssets/familyCard.mp4';
import createCard from '../../pageAssets/createCard.mp4';

import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Home = () => {
    const handleGetStartedClick = () => {
        document.getElementById('mainContent').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <Nav_Home />
            <div className='homePage'>
                <video src={bgHome} autoPlay muted loop></video>
                <div className="contentContainer">
                    <h1>Welcome to AncesTREE</h1>
                    <p>Unraveling Ancestral Lineages through Geographical History</p>
                    <button onClick={handleGetStartedClick}>GET STARTED</button>
                </div>
                <div id="mainContent" className="mainContent">
                    {/* Search Family Section */}
                    <div className="searchFamily">
                        <video className="searchCardVideo" src={searchCard} autoPlay muted loop></video>
                        <a href='/search'><button>Search Now</button></a>
                    </div>
                    
                    {/* View Record Section */}
                    <div className="viewRecords">
                        <video className="recordCardVideo" src={recordCard} autoPlay muted loop></video>
                        <a href='/search'><button>Go</button></a>
                    </div>

                    {/* Family Tree Section */}
                    <div className="familyTree">
                        <video className="familyCardVideo" src={familyCard} autoPlay muted loop></video>
                        <a href='/search'><button>Go</button></a>
                    </div>

                    {/* Create Account Section */}
                    <div className="createAccount">
                        <button className="signIn">
                            Sign In
                        </button>
                    
                        <video className="createCardVideo" src={createCard} autoPlay muted loop></video>

                    </div>

                    



                </div>

                {/* Footer Section */}
                <footer className="footer">
                    <p>© 2024 AncesTREE. All rights reserved.</p>
                    <div className="socialMedia">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Home;
