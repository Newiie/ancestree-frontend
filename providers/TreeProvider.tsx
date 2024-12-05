import { baseUrl } from '@/lib/config';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';
import TreeService from '@/services/api/treeService';

interface TreeContextType {
  addFamilyMember: boolean;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  treeData: any;
  editPersonModal: boolean;
  setEditPersonModal: (value: boolean) => void;
  setTreeData: (data: any) => void;
  handleAddFamilyMember: (formData: any) => void;
  handleEditPerson: (formData: any) => void;
  selectedNode: any;
  handleDeletePersonNode: () => Promise<void>;
  setSelectedNode: (node: any) => void;
  isFetching: boolean;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

interface TreeNode {
  personNodeId: string;
  name: string;
  children: TreeNode[];
  parent?: Array<{ personNodeId: string }>;
}

export const TreeProvider: React.FC<{ children: ReactNode, id: string }> = ({ children, id }) => {

    const [addFamilyMember, setAddFamilyMember] = useState(false);
    const [editPersonModal, setEditPersonModal] = useState(false);
    const [selectedNode, setSelectedNode] = useState<string>(""); 
    const [treeId, setTreeId] = useState<string>("");
    const [isFetching, setIsFetching] = useState(false);
    const [apiEvent, setApiEvent] = useState(false);

    const [treeData, setTreeData] = useState<any>([]);

    useEffect(() => {
        if (id) {
            setIsFetching(true);
            TreeService.fetchTreeData(id).then((data) => {
                console.log("DATA TREE", data);
                console.log("ROOT ", data.familyTree.root);
                setTreeData([data.familyTree.root]);
                setTreeId(data.familyTree.treeId);
                setIsFetching(false);
            });
        }   
    }, [apiEvent,id]);



    const handleEditPerson = async (formData: any) => {
        toggleEditPersonModal();
        await TreeService.patchEditPersonNode(selectedNode, formData);
        setApiEvent(!apiEvent);
    }

    const handleAddFamilyMember = async (formData: any) => {
        toggleAddFamilyModal();
        console.log("SELECTED NODE", selectedNode);
        console.log("treeData", treeData);
        console.log("FORM DATA", formData);
        await TreeService.postAddChild(treeId, selectedNode, formData);
        setApiEvent(!apiEvent);
    };

    const toggleAddFamilyModal = () => {
        setAddFamilyMember(!addFamilyMember);
    };

    const toggleEditPersonModal = () => {
        setEditPersonModal(!editPersonModal);
    }

    const handleDeletePersonNode = async () => {
        await TreeService.deletePersonNode(selectedNode);
        toggleEditPersonModal();
        setApiEvent(!apiEvent);
    };

    return (
    <TreeContext.Provider value={{ 
        addFamilyMember, toggleAddFamilyModal, handleDeletePersonNode,
        treeData, setTreeData, 
        handleAddFamilyMember, toggleEditPersonModal, handleEditPerson,
        editPersonModal, setEditPersonModal,
        selectedNode, setSelectedNode, isFetching }}>
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

