"use client"
import Content from '@/components/dashboard/FamilyTree/Content'
import React from 'react'
import { AnimatePresence } from 'framer-motion';
import FamilyTreeSkeleton from './loading'
import { TreeProvider, useTree } from '../../../../providers/TreeProvider'
import AddFamilyMemberModal from '@/components/dashboard/FamilyTree/modals/AddFamilyMemberModal'
import EditPersonModal from '@/components/dashboard/FamilyTree/modals/EditPersonModal'
import ConnectPersonModal from '@/components/dashboard/FamilyTree/modals/ConnectPersonModal'

const FamilyTreeContent = () => {
  const {
    addFamilyMember,
    editPersonModal,
    showConnectPersonModal,
    isFetching
  } = useTree();

  if (isFetching) return <FamilyTreeSkeleton />;

  return (
    <div className="relative content tree-content | h-full overflow-hidden">
        <Content />
        <AnimatePresence>
        {showConnectPersonModal && <ConnectPersonModal />}
        {addFamilyMember && <AddFamilyMemberModal />}
        {editPersonModal && <EditPersonModal />}
      </AnimatePresence>
    </div>
  )
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <TreeProvider id={id}>
      <FamilyTreeContent />
    </TreeProvider>
  );
}

export default Page
