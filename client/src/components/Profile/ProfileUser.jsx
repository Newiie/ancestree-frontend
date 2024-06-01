import React, { useState, useEffect } from 'react';
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import './ProfileUser.css';

const ProfileUser = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            setEditedDetails(docSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is signed in");
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails({ ...editedDetails, [name]: value });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "Users", user.uid);
        await setDoc(docRef, editedDetails, { merge: true });
        setUserDetails(editedDetails);
        setEditMode(false);
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-user">
      <div className="profile-header">
        <img src={userDetails.profilePicture} alt="Profile" className="profile-picture" />
        <h1>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={editedDetails.name}
              onChange={handleChange}
            />
          ) : (
            userDetails.name
          )}
        </h1>
        <p>
          {editMode ? (
            <input
              type="date"
              name="birthDate"
              value={editedDetails.birthDate}
              onChange={handleChange}
            />
          ) : (
            userDetails.birthDate
          )}{" "}
          -{" "}
          {editMode ? (
            <input
              type="date"
              name="deathDate"
              value={editedDetails.deathDate || ''}
              onChange={handleChange}
            />
          ) : (
            userDetails.deathDate || 'Living'
          )}
        </p>
        <p>ID: {userDetails.id}</p>
        <div className="profile-actions">
          <button>View Tree</button>
          <button>View Relationship</button>
          <button>Follow</button>
        </div>
      </div>
      <div className="profile-tabs">
        <button className="active">Details</button>
        <button>Sources</button>
        <button>Collaborate</button>
        <button>Time Line</button>
      </div>
      <div className="profile-content">
        <div className="profile-section">
          <h2>Vitals</h2>
          <div className="vitals">
            <p>
              <strong>Name:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={editedDetails.name}
                  onChange={handleChange}
                />
              ) : (
                userDetails.name
              )}
            </p>
            <p>
              <strong>Birth:</strong>{" "}
              {editMode ? (
                <input
                  type="date"
                  name="birthDate"
                  value={editedDetails.birthDate}
                  onChange={handleChange}
                />
              ) : (
                userDetails.birthDate
              )}
            </p>
            <p>
              <strong>Death:</strong>{" "}
              {editMode ? (
                <input
                  type="date"
                  name="deathDate"
                  value={editedDetails.deathDate || ''}
                  onChange={handleChange}
                />
              ) : (
                userDetails.deathDate || 'Living'
              )}
            </p>
            <p>
              <strong>Sex:</strong>{" "}
              {editMode ? (
                <select
                  name="sex"
                  value={editedDetails.sex}
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                userDetails.sex
              )}
            </p>
          </div>
        </div>
        <div className="profile-section">
          <h2>Other Information</h2>
          <p>Alternate Names</p>
          <p>Events</p>
          <p>Facts</p>
        </div>
        <div className="profile-section">
          <h2>Family Members</h2>
          <p>Spouses and Children</p>
          <p>Parents and Siblings</p>
        </div>
        <div className="profile-section">
          <h2>Notes</h2>
          <p>Add a note</p>
        </div>
        <div className="profile-section">
          <h2>Latest Changes</h2>
          <p>View all changes</p>
        </div>
        <div className="profile-section">
          <h2>Tools</h2>
          <p>My Layout Settings</p>
          <p>What's New?</p>
          <p>Possible Duplicates</p>
          <p>Find Similar People</p>
          <p>Merge By ID</p>
          <p>Report Abuse</p>
          <p>Delete Person</p>
          <p>Print Options</p>
        </div>
        <div className="profile-section">
          {editMode ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileUser;
