import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { updateEmail } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Settings/Settings_Content.css";

const Settings_Content = () => {
  return (
    <div>Settings_Content</div>
  )
}

export default Settings_Content
