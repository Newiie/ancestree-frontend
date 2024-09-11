

import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FamilyInfo from '../../components/FamilyTree/FamilyInfo.jsx';
import './ProfileUser.css';
import places from "../../pageAssets/places.json"
import bloodtype from "../../pageAssets/bloodtype.json"


const ProfileUser = () => {
  const [userDetails, setUserDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [familyData, setFamilyData] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            data.id = user.uid;
            console.log("User data:", data);
            setUserDetails(data);
            setEditedDetails(data);
            setFamilyData(data.family);
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

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const user = auth.currentUser;

    if (user && file) {
      try {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        const profilePictureURL = await getDownloadURL(storageRef);
        setEditedDetails((prevDetails) => ({
          ...prevDetails,
          profilePicture: profilePictureURL
        }));
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          profilePicture: profilePictureURL
        }));
        console.log("New profile picture URL:", profilePictureURL);
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    }
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Details":
        return (
          <div className="profile-section">
            <h2>Personal Details</h2>
            <div className="vitals">
              <p>
                <strong>First Name:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editedDetails.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.firstName
                )}
              </p>
              <p>
                <strong>Middle Name:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="middleName"
                    value={editedDetails.middleName}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.middleName
                )}
              </p>
              <p>
                <strong>Last Name:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editedDetails.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.lastName
                )}
              </p>
              <p>
                <strong>Nickname:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="nickname"
                    value={editedDetails.nickname}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.nickname
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
                <strong>Country:</strong>{" "}
                {editMode ? (
                  <select
                    name="country"
                    value={editedDetails.country}
                    onChange={handleChange}
                  >
                    <option value="">Select a place</option>
                    {places.map((place) => (
                      <option key={place.id} value={place.name}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  userDetails.country
                )}
              </p>
              <p>
                <strong>Place of Birth:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={editedDetails.placeOfBirth}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.placeOfBirth
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
                  userDetails.deathDate || 'N/A :: Living'
                )}
              </p>
              <p>
                <strong>Nationality:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="nationality"
                    value={editedDetails.nationality}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.nationality
                )}
              </p>
              <p>
                <strong>Marital Status:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="maritalStatus"
                    value={editedDetails.maritalStatus}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.maritalStatus
                )}
              </p>
              <h2>Vitals</h2>
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
              <p>
                <strong>Blood Type:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="bloodType"
                    value={editedDetails.bloodType}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.bloodType
                )}
              </p>
              <p>
                <strong>Allergies:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="allergies"
                    value={editedDetails.allergies}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.allergies
                )}
              </p>
              <p>
                <strong>Chronic Conditions:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="chronicConditions"
                    value={editedDetails.chronicConditions}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.chronicConditions
                )}
              </p>
              <p>
                <strong>Disabilities:</strong>{" "}
                {editMode ? (
                  <input
                    type="text"
                    name="disabilities"
                    value={editedDetails.disabilities}
                    onChange={handleChange}
                  />
                ) : (
                  userDetails.disabilities
                )}
              </p>
            </div>
          </div>
        );
      case "AddInfo":
        return (
          <div className="profile-section">
            <h2>Additional Information</h2>
            <p>
              <strong>Email:</strong>{" "}
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={editedDetails.email}
                  onChange={handleChange}
                />
              ) : (
                userDetails.email
              )}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {editMode ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedDetails.phoneNumber}
                  onChange={handleChange}
                />
              ) : (
                userDetails.phoneNumber
              )}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={editedDetails.address}
                  onChange={handleChange}
                />
              ) : (
                userDetails.address
              )}
            </p>
            <p>
              <strong>Family:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="family"
                  value={editedDetails.family}
                  onChange={handleChange}
                />
              ) : (
                userDetails.family
              )}
            </p>
            <p>
              <strong>Hobbies:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="hobbies"
                  value={editedDetails.hobbies}
                  onChange={handleChange}
                />
              ) : (
                userDetails.hobbies
              )}
            </p>
            <p>
              <strong>Languages Spoken:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="languagesSpoken"
                  value={editedDetails.languagesSpoken}
                  onChange={handleChange}
                />
              ) : (
                userDetails.languagesSpoken
              )}
            </p>
            <p>
              <strong>Religion:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="religion"
                  value={editedDetails.religion}
                  onChange={handleChange}
                />
              ) : (
                userDetails.religion
              )}
            </p>
            <p>
              <strong>Social Media Profiles:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="socialMediaProfiles"
                  value={editedDetails.socialMediaProfiles}
                  onChange={handleChange}
                />
              ) : (
                userDetails.socialMediaProfiles
              )}
            </p>
            <h2>Education</h2>
            <p>
              <strong>Highest Degree:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="highestDegree"
                  value={editedDetails.highestDegree}
                  onChange={handleChange}
                />
              ) : (
                userDetails.highestDegree
              )}
            </p>
            <p>
              <strong>School/University:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="schoolUniversity"
                  value={editedDetails.schoolUniversity}
                  onChange={handleChange}
                />
              ) : (
                userDetails.schoolUniversity
              )}
            </p>
            <p>
              <strong>Field of Study:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={editedDetails.fieldOfStudy}
                  onChange={handleChange}
                />
              ) : (
                userDetails.fieldOfStudy
              )}
            </p>
            <h2>Employment</h2>
            <p>
              <strong>Occupation:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="occupation"
                  value={editedDetails.occupation}
                  onChange={handleChange}
                />
              ) : (
                userDetails.occupation
              )}
            </p>
            <p>
              <strong>Employer:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="employer"
                  value={editedDetails.employer}
                  onChange={handleChange}
                />
              ) : (
                userDetails.employer
              )}
            </p>
            <p>
              <strong>Years of Experience:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={editedDetails.yearsOfExperience}
                  onChange={handleChange}
                />
              ) : (
                userDetails.yearsOfExperience
              )}
            </p>
            <h2>Family Contact</h2>
            <p>
              <strong>Name:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="familyContactName"
                  value={editedDetails.familyContactName}
                  onChange={handleChange}
                />
              ) : (
                userDetails.familyContactName
              )}
            </p>
            <p>
              <strong>Relationship:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="familyContactRelationship"
                  value={editedDetails.familyContactRelationship}
                  onChange={handleChange}
                />
              ) : (
                userDetails.familyContactRelationship
              )}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {editMode ? (
                <input
                  type="tel"
                  name="familyContactPhoneNumber"
                  value={editedDetails.familyContactPhoneNumber}
                  onChange={handleChange}
                />
              ) : (
                userDetails.familyContactPhoneNumber
              )}
            </p>
            <p>
              <strong>Miscellaneous:</strong>{" "}
              {editMode ? (
                <input
                  type="text"
                  name="familyContactMiscellaneous"
                  value={editedDetails.familyContactMiscellaneous}
                  onChange={handleChange}
                />
              ) : (
                userDetails.familyContactMiscellaneous
              )}
            </p>
          </div>
        );
      case "Connect":
        return (
          <div className="profile-section">
            <h2>Connect</h2>
            {/* Connect must contain the ff: list of people you're connected with, some kind of display */}
          </div>
        );
      case "Timeline":
        return (
          <div className="profile-section">
            <h2>Timeline</h2>
            {/* Timeline content */}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className='loading-state'>Loading...</div>;
  }

  const placeholderImage = "https://via.placeholder.com/150"; // Placeholder for image URL

  return (
    <div className="profile-user">
      <div className="profile-header">
        <div className="profile-header-top">
          <img
            src={userDetails.profilePicture || placeholderImage}
            alt="Profile"
            className="profile-picture"
          />
          <div className="profile-name">
            <h1>
              {editMode ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedDetails.firstName}
                  onChange={handleChange}
                />
              ) : (
                userDetails.firstName
              )}{" "}
              {editMode ? (
                <input
                  type="text"
                  name="middleName"
                  value={editedDetails.middleName}
                  onChange={handleChange}
                />
              ) : (
                userDetails.middleName
              )}{" "}
              {editMode ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedDetails.lastName}
                  onChange={handleChange}
                />
              ) : (
                userDetails.lastName
              )}
            </h1>
          </div>
        </div>
        {editMode && (
          <input
            className="profpic"
            type="file"
            id="profilePictureInput"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        )}
        <p>ID: {userDetails.id}</p>
        <div className="profile-actions">
          <a href="/family_tree"><button>View Tree</button></a>
          <button>View Relationship</button>
          <button>Followers</button>
        </div>
      </div>
      <div className="profile-tabs">
        <button onClick={() => setActiveTab("Details")} className={activeTab === "Details" ? "active" : ""}>Personal Details</button>
        <button onClick={() => setActiveTab("AddInfo")} className={activeTab === "AddInfo" ? "active" : ""}>Additional Information</button>
        <button onClick={() => setActiveTab("Connect")} className={activeTab === "Connect" ? "active" : ""}>Connect</button>
        <button onClick={() => setActiveTab("Timeline")} className={activeTab === "Timeline" ? "active" : ""}>Timeline</button>
      </div>
      <div className="profile-content">
        {renderTabContent()}
        <FamilyInfo familyData={familyData} />
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
