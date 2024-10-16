import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TreeContextType {
  addFamilyMember: boolean;
  toggleAddFamilyModal: () => void;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [addFamilyMember, setAddFamilyMember] = useState(true);

  const toggleAddFamilyModal = () => {
    setAddFamilyMember(!addFamilyMember);
  };

  return (
    <TreeContext.Provider value={{ addFamilyMember, toggleAddFamilyModal }}>
      {children}
    </TreeContext.Provider>
  );
};

export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};

