import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import Nav_Home from '../NavBar/Nav_Home';

// asset imports
import video from '../../pageAssets/backgroundHome.mp4';
import logo from '../../loginAssets/doge.png';

// icon imports
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  // usestate hook to store inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigateTo = useNavigate();

  // onlick get user inputs 
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      navigateTo('/dashboard');
      console.log('User Logged In Successfully');
      toast.success('User Logged In Successfully', {
        position: 'top-center',
      });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: 'bottom-center',
      });
    }
  };

  return (
    <div> <Nav_Home/>
    <div className='loginPage flex'>
      {/* <div className='container flex'> */}
        <div className='videoDiv'>
          <video src={video} autoPlay muted loop></video>
          <div className='overlay'></div>

          <div className='textDiv'>
            <h2 className='title'>AncesTREE</h2>
            <p>Unraveling Ancestral Lineages through Geographical History</p>
          </div>

          <div className='footerDiv flex'>
            <span className='text'>Don't have an account?</span>
            <Link to='/register'>
              <button className='btn'>Sign Up</button>
            </Link>
          </div>
        </div>

        <div className='formDiv flex'>
          <div className='headerDiv'>
            
            <h1>Welcome Back!</h1>
          </div>
          <form className='form grid' onSubmit={loginUser}>
            <div className='inputDiv'>
              <label htmlFor='email'>Email</label>
              <div className='input flex'>
                <FaUserShield className='icon' />
                <input
                  type='email'
                  id='email'
                  placeholder='Enter email'
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className='inputDiv'>
              <label htmlFor='password'>Password</label>
              <div className='input flex'>
                <BsFillShieldLockFill className='icon' />
                <input
                  type='password'
                  id='password'
                  placeholder='Enter password'
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                />
              </div>
            </div>

            <button type='submit' className='btn flex'>
              <span>Login </span>
              <AiOutlineSwapRight className='icon' />
            </button>

            <span className='forgotPassword'>
              Forgot your password? <a href=''>Click Here</a>
            </span>
          </form>
        </div>
      {/* </div> */}
      <ToastContainer/>
    </div>
    </div>
  );
};

export default Login;
