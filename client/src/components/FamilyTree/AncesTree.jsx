import React from 'react';
import Tree from 'react-d3-tree';
import './AncesTree.css';

const AncesTree = ({ data, onEditTree }) => {
  return (
    <div className="tree-container">
      {data ? (
        <Tree
          data={data}
          orientation="vertical"
          collapsible
          initialDepth={2}
          transitionDuration={500}
        />
      ) : (
        <div className="no-data">
          <p>No family tree data available.</p>
        </div>
      )}
      <button className="edit-button" onClick={onEditTree}>
        {data ? "Edit Tree" : "Add Tree"}
      </button>
    </div>
  );
};

export default AncesTree;
