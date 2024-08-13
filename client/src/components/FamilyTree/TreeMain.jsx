

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import FamilyTreeForm from './FamilyTreeForm';
import AncesTree from './AncesTree';
import FamilyInfo from './FamilyInfo';
import "./TreeMain.css";
import Rel_Content from '../Relationships/Rel_Content';

const TreeMain = () => {
  const [familyTreeData, setFamilyTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingTree, setIsEditingTree] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamilyTree = async (user) => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          console.log("Fetched family tree data:", docSnap.data().familyTree);
          setFamilyTreeData(docSnap.data().familyTree);
        } else {
          console.log("No family tree data available");
          setFamilyTreeData(null);
        }
      } catch (error) {
        console.error("Error fetching family tree data:", error);
        setError("Error fetching family tree data.");
      }
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchFamilyTree(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFormSubmit = async (data) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const cleanData = {
          ...data,
          partner: data.partner || null, // Ensures that 'partner' field is not undefined
          children: data.children.map(child => ({
            ...child,
            partner: child.partner || null,
            children: child.children || []
          }))
        };

        const userDocRef = doc(db, "Users", user.uid);
        await setDoc(userDocRef, { familyTree: cleanData }, { merge: true });
        console.log("Saved family tree data:", cleanData);
        setFamilyTreeData(cleanData);
        setIsEditingTree(false);
        navigate('/family_tree');  
      } catch (error) {
        console.error("Error saving family tree data:", error);
        setError("Error saving family tree data.");
      }
    } else {
      console.error("User not authenticated.");
      setError("User not authenticated.");
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="TreeMain" >
      <div style={{ flex: 1, padding: '10px' }}>
        <h1>Family Tree</h1>
        <AncesTree 
          data={familyTreeData} 
          onEditTree={() => setIsEditingTree(true)} 
        />
        {isEditingTree && (
          <FamilyTreeForm 
            onSubmit={handleFormSubmit} 
            initialData={familyTreeData} 
            onClose={() => setIsEditingTree(false)}
          />
        )}
      </div>
      
      <FamilyInfo familyData={familyTreeData} />
      
      
        
    </div>
  );
};

export default TreeMain;
