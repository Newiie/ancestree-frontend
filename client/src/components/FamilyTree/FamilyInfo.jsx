

import React from 'react';
import './FamilyInfo.css';

const FamilyInfo = ({ familyData }) => {
  if (!familyData) {
    return null;
  }

  const renderChildren = (children) => {
    return children.map((child, index) => (
      <div className="family-card" key={index}>
        <div className="card-header">
          <h3>{child.name}</h3>
          <button className="edit-button">Edit</button>
        </div>
        <p><strong>Partner:</strong> {child.partner || 'N/A'}</p>
        <p><strong>Children:</strong> {child.children.map((grandchild) => grandchild.name).join(', ') || 'No children'}</p>
      </div>
    ));
  };

  const renderGrandchildren = (children) => {
    return children.map((child) =>
      child.children.map((grandchild, index) => (
        <div className="family-card" key={index}>
          <div className="card-header">
            <h3>{grandchild.name}</h3>
            <button className="edit-button">Edit</button>
          </div>
        </div>
      ))
    );
  };

  return (
    <div className="family-info">
      <h2>Family Details</h2>
      <div className="family-card">
        <div className="card-header">
          <h3>{familyData.name}</h3>
          <button className="edit-button">Edit</button>
        </div>
      </div>
      <div className="family-card">
        <div className="card-header">
          <h3>{familyData.partner}</h3>
          <button className="edit-button">Edit</button>
        </div>
      </div>
      <p><strong>Children of {familyData.name} and {familyData.partner}:</strong></p>
      {renderChildren(familyData.children)}
      <p><strong>Grandchildren of {familyData.name} and {familyData.partner}:</strong></p>
      {renderGrandchildren(familyData.children)}
    </div>
  );
};

export default FamilyInfo;
