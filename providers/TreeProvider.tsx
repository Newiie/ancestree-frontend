import { baseUrl } from '@/lib/config';
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import useAuth from '@/hooks/useAuth';
import TreeService from '@/services/api/treeService';
import { setUser } from '@/store/userSlice';
import { toast } from 'sonner';
import { TreeNode } from '@/types/tree';

interface TreeContextType {
  addFamilyMember: boolean;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  treeData: TreeNode[];
  editPersonModal: boolean;
  showConnectPersonModal: boolean;
  setEditPersonModal: (value: boolean) => void;
  setShowConnectPersonModal: (value: boolean) => void;
  toggleConnectPersonModal: () => void;
  setTreeData: (data: TreeNode[]) => void;
  handleAddFamilyMember: (selectedPerson: string, formData: FormData) => void;
  handleEditPerson: (formData: FormData) => void;
  selectedNode: string;
  handleDeletePersonNode: () => Promise<void>;
  setSelectedNode: (node: string) => void;
  handleConnectPersonToUser: (userId: string) => void;
  isFetching: boolean;
  userId: string;
  selectedPerson: React.MutableRefObject<string>;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const TreeProvider: React.FC<{ children: ReactNode, id: string }> = ({ children, id }) => {

    const [addFamilyMember, setAddFamilyMember] = useState(false);
    const [editPersonModal, setEditPersonModal] = useState(false);
    const [showConnectPersonModal, setShowConnectPersonModal] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [treeId, setTreeId] = useState<string>("");
    const [isFetching, setIsFetching] = useState(false);
    const [apiEvent, setApiEvent] = useState(false);
    const selectedPerson = useRef("");
    const [treeData, setTreeData] = useState<TreeNode[]>([]);

    useEffect(() => {
        if (id) {
            setIsFetching(true);
            setUserId(id);
            TreeService.fetchTreeData(id)
                .then((data) => {
                    setTreeData([data.familyTree.root]);
                    setTreeId(data.familyTree.root.id);
                })
                .catch(() => {
                    toast.error('Failed to load family tree. Please refresh the page.');
                })
                .finally(() => {
                    setIsFetching(false);
                });
        }
    }, [apiEvent, id]);

    const handleEditPerson = async (formData: FormData) => {
        setIsFetching(true);
        try {
            await TreeService.patchEditPersonNode(selectedNode, formData);
            toggleEditPersonModal();
            setApiEvent(!apiEvent);
        } catch {
            toast.error('Failed to update person. Please try again.');
        } finally {
            setIsFetching(false);
        }
    }

    const handleAddFamilyMember = async (selectedPerson: string, formData: FormData) => {
        setIsFetching(true);
        try {
            if (selectedPerson === "Add Child") {
                await TreeService.postAddChild(treeId, formData);
            } else {
                await TreeService.postAddParent(treeId, formData);
            }
            toggleAddFamilyModal();
            setApiEvent(!apiEvent);
        } catch {
            toast.error('Failed to add family member. Please try again.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleConnectPersonToUser = async (userId: string) => {
        setIsFetching(true);
        try {
            await TreeService.postConnectPersonToUser(userId, selectedNode);
            setApiEvent(!apiEvent);
        } catch {
            toast.error('Failed to connect person. Please try again.');
        } finally {
            setIsFetching(false);
        }
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
        setIsFetching(true);
        try {
            await TreeService.deletePersonNode(selectedNode);
            setApiEvent(!apiEvent);
        } catch {
            toast.error('Failed to delete person. Please try again.');
        } finally {
            setIsFetching(false);
        }
    };

    return (
    <TreeContext.Provider value={{
        addFamilyMember,
        selectedPerson,
        userId,
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

