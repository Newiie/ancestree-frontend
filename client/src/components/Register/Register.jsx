import React, { useState } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import '../../App.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { setDoc, doc } from "firebase/firestore";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav_Home from '../NavBar/Nav_Home';

// Asset imports
import video from '../../loginAssets/miku_vid.mp4';
import logo from '../../loginAssets/doge.png';

// Icon imports
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';

const Register = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created: ", user);

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          user_name: userName,
        });
        toast.success('User registered successfully!', {
            position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error creating user or adding user data to Firestore: ", error.message);
      toast.error(error.message);
    //   setErrorMessage(error.message);
    }
  };

  return (

    <div> <Nav_Home/>
    <div className='registerPage flex'>
      <div className="container flex">
        <div className="videoDiv">
          <video src={video} autoPlay muted loop></video>
          <div className="textDiv">
            <h2 className='title'>AncesTREE</h2>
            <p>Unraveling Ancestral Lineages through Geographical History</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">Already have an account?</span>
            <Link to={'/login'}>
              <button className='btn'>Log In</button>
            </Link>
          </div>
        </div>
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="Doge" />
            <h1>Register Now</h1>
          </div>
          <form className='form grid' onSubmit={createUser}>
            {errorMessage && <span className='error'>{errorMessage}</span>}
            <div className="inputDiv">
              <label htmlFor="email">Email</label>
              <div className="input flex">
                <MdEmail className='icon' />
                <input
                  type="email"
                  id='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="username">Username</label>
              <div className="input flex">
                <FaUserShield className='icon' />
                <input
                  type="text"
                  id='username'
                  placeholder='Enter username'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Password</label>
              <div className="input flex">
                <BsFillShieldLockFill className='icon' />
                <input
                  type="password"
                  id='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type='submit' className='btn flex'>
              <span>Register </span>
              <AiOutlineSwapRight className='icon' />
            </button>
            <span className='forgotPassword'>
              Forgot your password? <a href="">Click Here</a>
            </span>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default Register;
