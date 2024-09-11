import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import './AncesTree.css';

const AncesTree = ({ data, onEditTree }) => {
  const [treeData, setTreeData] = useState(data);

  useEffect(() => {
    if (data && data.length) {
      setTreeData(data);
    }
  }, [data]);

  console.log("TREE DATA", treeData)
  const handleNodeClick = (nodeData) => {
    const newNodeName = prompt('Enter the name for the new child node:');
    if (newNodeName) {
      console.log("NODE DATA", nodeData)
      const updatedData = addNode(treeData, nodeData, newNodeName);
      setTreeData(updatedData);
      console.log("Updated TREE DATA", updatedData);
    }
  };

  const addNode = (data, targetNode, nodeName) => {
    // Recursively search for the target node and add a new child
    if (data.name === targetNode.data.name) {
      return {
        ...data,
        children: [...(data.children || []), { name: nodeName, children: [] }],
      };
    }
    if (data.children) {
      return {
        ...data,
        children: data.children.map((child) => addNode(child, targetNode, nodeName)),
      };
    }
    return data;
  };

  return (
    <div className="tree-container">
      {treeData ? (
        <Tree
          data={treeData}
          orientation="vertical"
          collapsible
          initialDepth={2}
          transitionDuration={500}
          onNodeClick={handleNodeClick}
        />
      ) : (
        <div className="no-data">
          <p>No family tree data available.</p>
        </div>
      )}
      <button className="edit-button" onClick={onEditTree}>
        {treeData ? "Edit Tree" : "Add Tree"}
      </button>
    </div>
  );
};

export default AncesTree;
