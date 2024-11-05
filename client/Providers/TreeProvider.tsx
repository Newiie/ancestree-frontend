import { baseUrl } from '@/lib/config';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';

interface TreeContextType {
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

const TreeContext = createContext<TreeContextType | undefined>(undefined);

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
  parent?: Array<{ id: string }>;
}

export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    const [addFamilyMember, setAddFamilyMember] = useState(false);
    const [editPersonModal, setEditPersonModal] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null); 

    useEffect(() => {
        const fetchTreeData = async () => {
            const response = await axios.get(`${baseUrl}/trees/family-tree/${user?.id}`);
            console.log("RESPONSE", response);
        }

        fetchTreeData();
    }, []);

    const [treeData, setTreeData] = useState<TreeNode[]>([
        { id: '1', name: 'Child', 
            children: [
            { id: '2', name: 'Grandchild', 
                children: [
                { id: '3', name: 'Great Grandchild', children: [], parent: [{ id: '2' }] },
                { id: '4', name: 'Great Grandchild', children: [], parent: [{ id: '2' }] },
                ],
                parent: [{ id: '1' }],
            },
            { id: '5', name: 'Grandchild', children: [
                { id: '6', name: 'Great Grandchild', children: [], parent: [{ id: '5' }] },
                { id: '7', name: 'Great Grandchild', children: [
                    { id: '8', name: 'Great Great Grandchild', children: [], parent: [{ id: '7' }]   },
                ],
                parent: [{ id: '5' }],
            }],
            parent: [{ id: '1' }],
            },
        ] },
    ]);

    const handleEditPerson = () => {
        toggleEditPersonModal();
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
    <TreeContext.Provider value={{ 
        addFamilyMember, toggleAddFamilyModal, 
        treeData, setTreeData, 
        handleAddFamilyMember, toggleEditPersonModal, handleEditPerson,
        editPersonModal, setEditPersonModal,
        selectedNode, setSelectedNode }}>
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

