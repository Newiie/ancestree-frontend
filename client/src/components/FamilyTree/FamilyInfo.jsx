import React from 'react';

const FamilyInfo = ({ familyData }) => {
  if (!familyData) {
    return null;
  }

  const renderChildren = (children) => {
    return children.map((child, index) => (
      <tr key={index}>
        <td>{child.name}</td>
        <td>{child.partner || 'N/A'}</td>
        <td>
          {child.children.map((grandchild) => grandchild.name).join(', ') || 'No children'}
        </td>
      </tr>
    ));
  };

  return (
    <div style={{ width: '30%', border: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
      <h2>Family Details</h2>
      <table>
        <thead>
          <tr>
            <th>Person</th>
            <th>Partner</th>
            <th>Children</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{familyData.name}</td>
            <td>N/A</td>
            <td>
              {familyData.children.map((child) => child.name).join(', ')}
            </td>
          </tr>
          {renderChildren(familyData.children)}
        </tbody>
      </table>
    </div>
  );
};

export default FamilyInfo;

