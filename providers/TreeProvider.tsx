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
  showConnectPersonModal: boolean;
  setEditPersonModal: (value: boolean) => void;
  setShowConnectPersonModal: (value: boolean) => void;
  toggleConnectPersonModal: () => void;
  setTreeData: (data: any) => void;
  handleAddFamilyMember: (selectedPerson: string, formData: any) => void;
  handleEditPerson: (formData: any) => void;
  selectedNode: any;
  handleDeletePersonNode: () => Promise<void>;
  setSelectedNode: (node: any) => void;
  handleConnectPersonToUser: (userId: string) => void;
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
    const [showConnectPersonModal, setShowConnectPersonModal] = useState(false);
    const [selectedNode, setSelectedNode] = useState<string>(""); 
    const [treeId, setTreeId] = useState<string>("");
    const [isFetching, setIsFetching] = useState(false);
    const [apiEvent, setApiEvent] = useState(false);

    const [treeData, setTreeData] = useState<any>([]);

    useEffect(() => {
        if (id) {
            setIsFetching(true);
            TreeService.fetchTreeData(id).then((data) => {
                console.log("FETCHED TREE DATA", data.familyTree.root);
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

    const handleAddFamilyMember = async (selectedPerson: string,formData: any) => {
        toggleAddFamilyModal();
        if (selectedPerson === "Add Child") {
            await TreeService.postAddChild(treeId, selectedNode, formData);
        } else {
            await TreeService.postAddParent(treeId, selectedNode, formData);
        }
        setApiEvent(!apiEvent);
    };

    const handleConnectPersonToUser = async (userId: string) => {
        await TreeService.postConnectPersonToUser(userId, selectedNode);
        setApiEvent(!apiEvent);
    }

    const toggleAddFamilyModal = () => {
        setAddFamilyMember(!addFamilyMember);
    };

    const toggleEditPersonModal = () => {
        setEditPersonModal(!editPersonModal);
    }

    const toggleConnectPersonModal = () => {
        setShowConnectPersonModal(!showConnectPersonModal);
    }

    const handleDeletePersonNode = async () => {
        await TreeService.deletePersonNode(selectedNode);
        setApiEvent(!apiEvent);
    };

    return (
    <TreeContext.Provider value={{ 
        addFamilyMember, 
        toggleAddFamilyModal, 
        handleDeletePersonNode,
        treeData,
        setTreeData, 
        handleAddFamilyMember, 
        toggleEditPersonModal, 
        handleEditPerson,
        editPersonModal, 
        setEditPersonModal,
        selectedNode, 
        setSelectedNode, 
        isFetching,
        showConnectPersonModal, 
        setShowConnectPersonModal,
        toggleConnectPersonModal,
        handleConnectPersonToUser
    }}>
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

