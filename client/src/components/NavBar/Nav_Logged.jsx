import React, { useEffect, useState } from 'react';
import './Nav.css';
import logo from '../../loginAssets/doge.png';
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';


const Nav_Logged = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigateTo = useNavigate();
  
  const fetchUserData = async (user) => {
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserDetails(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleLogout(){
    try{
    await auth.signOut();
    navigateTo('/login');
    console.log("User Logged Out Succesfully")
  } catch(error){
    console.error("Error Logging Out", error.message);
    }
  }


  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="AncesTREE" />
      </div>
      <ul className="navbar__links">
        <div>
          <li className='title_app' ><a href="/dashboard">AncesTREE</a></li>
        </div>
        

      </ul>
      <div className="navbar__search">
        {/* <input type="text" placeholder="Search" /> */}
      </div>
      <div className="userWelcome">
        {userDetails ? `WELCOME, ${userDetails.user_name}` : 'WELCOME'}
      </div>
      <div className="navbar__buttons">
        <button className="navbar__button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Nav_Logged;
