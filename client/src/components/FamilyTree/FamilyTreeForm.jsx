import React, { useState, useEffect } from 'react';

const FamilyTreeForm = ({ onSubmit, initialData }) => {
  const [rootName, setRootName] = useState(initialData ? initialData.name : '');
  const [children, setChildren] = useState(initialData ? initialData.children : [{ name: '', partner: '', children: [{ name: '' }] }]);

  useEffect(() => {
    if (initialData) {
      setRootName(initialData.name);
      setChildren(initialData.children);
    }
  }, [initialData]);

  const handleAddChild = () => {
    setChildren([...children, { name: '', partner: '', children: [{ name: '' }] }]);
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
      children: filteredChildren,
    });
  };

  return (
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
      <h3>Children</h3>
      {children.map((child, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
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
          <h4>Grandchildren of {child.name}</h4>
          {child.children.map((grandchild, gcIndex) => (
            <div key={gcIndex}>
              <input
                type="text"
                placeholder={`Grandchild ${gcIndex + 1}`}
                value={grandchild.name}
                onChange={(e) => handleGrandchildNameChange(index, gcIndex, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddGrandchild(index)}>
            Add Grandchild
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddChild}>
        Add Another Child
      </button>
      <br />
      <button type="submit">Save Tree</button>
    </form>
  );
};

export default FamilyTreeForm;



