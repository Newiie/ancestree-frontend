
import React, { useState } from 'react';
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import './Rel_Content.css'; 

const Rel_Content = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);
    const usersCollection = collection(db, "Users");

    try {
      const querySnapshot = await getDocs(usersCollection);
      const results = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userFirstName = userData.firstName ? userData.firstName.toLowerCase() : '';
        const userMiddleName = userData.middleName ? userData.middleName.toLowerCase() : '';
        const userLastName = userData.lastName ? userData.lastName.toLowerCase() : '';

        const isFirstNameMatch = userFirstName.includes(firstName.toLowerCase());
        const isMiddleNameMatch = userMiddleName.includes(middleName.toLowerCase());
        const isLastNameMatch = userLastName.includes(lastName.toLowerCase());

        if (isFirstNameMatch && isMiddleNameMatch && isLastNameMatch) {
          results.push(userData);
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }

    setLoading(false);
  };

  return (
    <div className="rel-content">
      <div className="search-field">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Middle Name"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="search-results">
          {searchPerformed && (
            <div className="result-count">{searchResults.length} result(s) found</div>
          )}
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div key={index} className="result-card">
                <img src={result.profilePicture || 'profile-pic-placeholder.png'} alt="Profile" className="profile-picture" />
                <div className="result-details">
                  <h3>{result.firstName} {result.middleName} {result.lastName}</h3>
                  <p>Sex: {result.sex}</p>
                  <p>Birthdate: {result.birthDate}</p>
                </div>
              </div>
            ))
          ) : (
            <div>No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rel_Content;
