

import React, { useState, useEffect } from 'react';
import './FamilyTreeForm.css';

const FamilyTreeForm = ({ onSubmit, initialData, onClose }) => {
  const [rootName, setRootName] = useState(initialData ? initialData.name : '');
  const [rootPartnerName, setRootPartnerName] = useState(initialData ? initialData.partner : '');
  const [children, setChildren] = useState(initialData ? initialData.children : [{ name: '', partner: '', children: [{ name: '' }] }]);

  useEffect(() => {
    if (initialData) {
      setRootName(initialData.name);
      setRootPartnerName(initialData.partner);
      setChildren(initialData.children);
    }
  }, [initialData]);

  const handleAddChild = () => {
    setChildren([...children, { name: '', partner: '', children: [{ name: '' }] }]);
  };

  const handleRemoveChild = (index) => {
    const updatedChildren = children.filter((_, i) => i !== index);
    setChildren(updatedChildren);
  };

  const handleRemoveGrandchild = (childIndex, grandchildIndex) => {
    const updatedChildren = [...children];
    updatedChildren[childIndex].children = updatedChildren[childIndex].children.filter((_, i) => i !== grandchildIndex);
    setChildren(updatedChildren);
  };

  const handleChildNameChange = (index, value) => {
    const updatedChildren = [...children];
    updatedChildren[index].name = value;
    setChildren(updatedChildren);
  };

  const handlePartnerNameChange = (index, value) => {
    const updatedChildren = [...children];
    updatedChildren[index].partner = value;
    setChildren(updatedChildren);
  };

  const handleAddGrandchild = (childIndex) => {
    const updatedChildren = [...children];
    updatedChildren[childIndex].children.push({ name: '' });
    setChildren(updatedChildren);
  };

  const handleGrandchildNameChange = (childIndex, grandchildIndex, value) => {
    const updatedChildren = [...children];
    updatedChildren[childIndex].children[grandchildIndex].name = value;
    setChildren(updatedChildren);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const filteredChildren = children.map((child) => ({
      name: child.name,
      partner: child.partner,
      children: child.children.filter((grandchild) => grandchild.name),
    })).filter((child) => child.name);
    onSubmit({
      name: rootName,
      partner: rootPartnerName,
      children: filteredChildren,
    });
  };

  return (
    <div className="form-overlay">
      <div className="popup-form">
        <button onClick={onClose}>Close</button>
        <form onSubmit={handleSubmit}>
          <label>
            Root Name:
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              required
            />
          </label>
          <label>
            Partner's Name:
            <input
              type="text"
              value={rootPartnerName}
              onChange={(e) => setRootPartnerName(e.target.value)}
            />
          </label>
          <h3>Children</h3>
          {children.map((child, index) => (
            <div key={index} className="child-container">
              <input
                type="text"
                placeholder={`Child ${index + 1}`}
                value={child.name}
                onChange={(e) => handleChildNameChange(index, e.target.value)}
                required
              />
              <label>
                Partner:
                <input
                  type="text"
                  placeholder="Partner's Name"
                  value={child.partner}
                  onChange={(e) => handlePartnerNameChange(index, e.target.value)}
                />
              </label>
              <h4>Children of {child.name}</h4>
              {child.children.map((grandchild, gcIndex) => (
                <div key={gcIndex} className="grandchild-container">
                  <input
                    type="text"
                    placeholder={`Grandchild ${gcIndex + 1}`}
                    value={grandchild.name}
                    onChange={(e) => handleGrandchildNameChange(index, gcIndex, e.target.value)}
                  />
                  <button type="button" className="icon-button" onClick={() => handleRemoveGrandchild(index, gcIndex)}>🗑️</button>
                </div>
              ))}
              <button type="button" className="icon-button" onClick={() => handleAddGrandchild(index)}>➕</button>
              <button type="button" className="icon-button" onClick={() => handleRemoveChild(index)}>🗑️</button>
            </div>
          ))}
          <button type="button" onClick={handleAddChild}>
            Add New Child
          </button>
          <br />
          <button type="submit">Save Tree</button>
        </form>
      </div>
    </div>
  );
};

export default FamilyTreeForm;
