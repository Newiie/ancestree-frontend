import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextType {
  addFamilyMember: boolean;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  treeData: any;
  editPersonModal: boolean;
  setEditPersonModal: (value: boolean) => void;
  setTreeData: (data: any) => void;
  handleAddFamilyMember: () => void;
  handleEditPerson: () => void;
  selectedNode: any;
  setSelectedNode: (node: any) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
}

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [addFamilyMember, setAddFamilyMember] = useState(false);
    const [editPersonModal, setEditPersonModal] = useState(false);
    
    const [selectedNode, setSelectedNode] = useState(null);

    const [treeData, setTreeData] = useState<TreeNode[]>([
        { id: '1', name: 'Child', children: [] },
    ]);

    const handleEditPerson = () => {

    }
    const handleAddFamilyMember = () => {
        console.log("SELECTED NODE", selectedNode);
        console.log("treeData", treeData);

        const addMemberToTree = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map(node => {
                if (node.id === selectedNode) {
                    return {
                        ...node,
                        children: [...node.children, { id: Date.now().toString(), name: 'New Family Member', children: [] }]
                    };
                }
                return {
                    ...node,
                    children: addMemberToTree(node.children)
                };
            });
        };

        setTreeData(addMemberToTree(treeData));
        toggleAddFamilyModal();
    };

    const toggleAddFamilyModal = () => {
        setAddFamilyMember(!addFamilyMember);
    };

    const toggleEditPersonModal = () => {
        setEditPersonModal(!editPersonModal);
    }

    return (
    <ModalContext.Provider value={{ 
        addFamilyMember, toggleAddFamilyModal, 
        treeData, setTreeData, 
        handleAddFamilyMember, toggleEditPersonModal, handleEditPerson,
        editPersonModal, setEditPersonModal,
        selectedNode, setSelectedNode }}>
        {children}
    </ModalContext.Provider>
    );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

