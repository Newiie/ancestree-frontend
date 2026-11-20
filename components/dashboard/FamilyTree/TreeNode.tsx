"use client";

import React from 'react';
import Image from 'next/image';
import { InfoIcon, PencilIcon, PlusIcon, UserRoundIcon, Calendar, Globe, MapPin, Users, User2 } from 'lucide-react';
import { useTree } from '@/providers/TreeProvider';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { selectId } from '@/store/userSlice';
import { useSelector } from 'react-redux';
import { TreeNode as TreeNodeType } from '@/types/tree';
import { FALLBACK_AVATAR } from '@/lib/constants';

interface TreeNodeProps {
  node: TreeNodeType;
  selectedNode: string;
  setSelectedNode: (id: string) => void;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  toggleConnectPersonModal: () => void;
  handleDeletePersonNode: () => Promise<void>;
}

const TreeNodeCard = ({
    node,
    selectedNode,
    setSelectedNode,
    toggleAddFamilyModal,
    toggleEditPersonModal,
    toggleConnectPersonModal,
    handleDeletePersonNode
}: TreeNodeProps) => {
    const router = useRouter();
    const { userId } = useTree();
    const currentUserId = useSelector(selectId);
    function capitalizeFirstLetter(text: string) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    return (
        <li key={node.id}>
            <a
                href="#"
                className='relative'
                onClick={() => setSelectedNode(node.id)}
            >
                <Image src={`${node?.person?.profilePicture || FALLBACK_AVATAR}`} alt={`${node?.person?.generalInformation?.firstName ?? node?.person?.generalInformation?.firstname} ${node?.person?.generalInformation?.lastName ?? node?.person?.generalInformation?.lastname}`} width={100} height={100} />
                <span>
                     {node?.person?.generalInformation?.firstName ?? node?.person?.generalInformation?.firstname}
                     {" "}
                     {node?.person?.generalInformation?.lastName ?? node?.person?.generalInformation?.lastname}
                </span>

                {selectedNode === node.id && (
                    <div className='absolute top-0 -right-[40px] z-10'>
                        <div className='relative flex flex-col gap-1'>
                            <button
                                onClick={() => {
                                    if (currentUserId !== userId) return;
                                    toggleAddFamilyModal()
                                }}
                                className='absolute top-0 right-[2px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <PlusIcon size={16} />
                            </button>

                            <button
                                onClick={() => {
                                    if (node?.person?.relatedUser) {
                                        router.push(`/dashboard/profile/${node?.person?.relatedUser}`);
                                    } else {
                                        toggleConnectPersonModal();
                                    }
                                }}
                                className='absolute top-[31px] right-[-14px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <UserRoundIcon size={16} />
                            </button>

                            <button
                                onClick={() => {
                                    if (currentUserId !== userId) return;
                                    toggleEditPersonModal()
                                }}
                                className='absolute top-[67px] right-[-14px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <PencilIcon size={16} />
                            </button>

                            <Sheet>
                                <SheetTrigger>
                                    <div
                                        className='absolute top-[98px] right-[1px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                                    >
                                        <InfoIcon size={16} />
                                    </div>
                                </SheetTrigger>
                                <SheetContent className="bg-[#faf9f7] border-l border-stone-200/60 overflow-y-auto p-0">
                                    {/* Profile header */}
                                    <div className="flex flex-col items-center gap-3 px-5 pt-8 pb-5 border-b border-stone-100">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1B5A1B]/20 shadow-md flex-shrink-0">
                                            <Image
                                                src={node?.person?.profilePicture || FALLBACK_AVATAR}
                                                alt="profile"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-base font-semibold text-stone-800">
                                                {[
                                                    node?.person?.generalInformation?.firstName,
                                                    node?.person?.generalInformation?.middleName,
                                                    node?.person?.generalInformation?.lastName,
                                                    node?.person?.generalInformation?.suffix,
                                                ].filter(Boolean).join(' ')}
                                            </h2>
                                            <span className={`mt-1.5 inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                                node?.person?.generalInformation?.status === 'living'
                                                    ? 'bg-[#D4F3C0]/60 text-[#1B5A1B]'
                                                    : node?.person?.generalInformation?.status === 'deceased'
                                                    ? 'bg-stone-100 text-stone-500'
                                                    : 'bg-stone-100 text-stone-400'
                                            }`}>
                                                {capitalizeFirstLetter(node?.person?.generalInformation?.status ?? 'Unknown')}
                                            </span>
                                        </div>
                                    </div>

                                    <SheetHeader className="sr-only">
                                        <SheetTitle>Person Information</SheetTitle>
                                        <SheetDescription>Overview of personal and family details.</SheetDescription>
                                    </SheetHeader>

                                    <div className="flex flex-col gap-4 px-5 py-5">

                                        {/* Personal details */}
                                        <div className="bg-stone-50/80 rounded-xl p-3 flex flex-col gap-2.5 border border-stone-100">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <User2 size={11} className="text-[#1B5A1B]/70" />
                                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Personal</p>
                                            </div>
                                            {node?.person?.vitalInformation?.sex && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-stone-400 font-medium">Sex</span>
                                                    <span className="text-sm text-stone-700">{capitalizeFirstLetter(node.person.vitalInformation.sex)}</span>
                                                </div>
                                            )}
                                            {node?.person?.generalInformation?.birthdate && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-stone-400 font-medium flex items-center gap-1"><Calendar size={10} />Birth Date</span>
                                                    <span className="text-sm text-stone-700">{node.person.generalInformation.birthdate.slice(0, 10)}</span>
                                                </div>
                                            )}
                                            {(node?.person?.generalInformation?.birthPlace || node?.person?.generalInformation?.birthCountry) && (
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs text-stone-400 font-medium flex items-center gap-1 flex-shrink-0"><MapPin size={10} />Birthplace</span>
                                                    <span className="text-sm text-stone-700 text-right">
                                                        {[node.person.generalInformation.birthPlace, node.person.generalInformation.birthCountry].filter(Boolean).join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Nationality */}
                                        {(node?.person?.generalInformation?.nationality?.length ?? 0) > 0 && (
                                            <div className="bg-stone-50/80 rounded-xl p-3 flex flex-col gap-2 border border-stone-100">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <Globe size={11} className="text-[#1B5A1B]/70" />
                                                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Nationality</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {node.person!.generalInformation!.nationality!.map((nat: string) => (
                                                        <span key={nat} className="inline-flex items-center bg-[#D4F3C0]/60 text-[#1B5A1B] px-2.5 py-1 rounded-full text-xs font-medium border border-[#1B5A1B]/10">
                                                            {capitalizeFirstLetter(nat)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Parents */}
                                        {(node?.parents?.length ?? 0) > 0 && (
                                            <div className="bg-stone-50/80 rounded-xl p-3 flex flex-col gap-2 border border-stone-100">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <Users size={11} className="text-[#1B5A1B]/70" />
                                                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Parents</p>
                                                </div>
                                                {node.parents!.map((parent: TreeNodeType, index: number) => (
                                                    <div key={parent.id ?? index} className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-stone-200 flex-shrink-0">
                                                            <Image
                                                                src={parent.person?.profilePicture || FALLBACK_AVATAR}
                                                                alt="parent"
                                                                width={24}
                                                                height={24}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm text-stone-700">
                                                            {[
                                                                parent.person?.generalInformation?.firstName,
                                                                parent.person?.generalInformation?.middleName,
                                                                parent.person?.generalInformation?.lastName,
                                                            ].filter(Boolean).map(capitalizeFirstLetter).join(' ')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Delete */}
                                        {currentUserId === userId && (
                                            <button
                                                className="w-full mt-1 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors duration-150"
                                                onClick={handleDeletePersonNode}
                                            >
                                                Delete Person
                                            </button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* {isHover &&
                                <AnimatePresence>
                                    <motion.div
                                        key={node.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        className="absolute top-0 -right-[12rem] "
                                    >
                                        <div className="flex flex-col gap-1 z-100 bg-[#FAFAFA] border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-2 rounded-[3px] w-[10rem] flex">
                                            <h1>Details: </h1>
                                            <span>{node.name}</span>
                                            <span>December 12, 1990</span>
                                            <span>Male</span>
                                            <span>Father</span>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            } */}
                        </div>
                    </div>
                )}
            </a>

            {/* Render children nodes */}
            {node.children && node.children.length > 0 && (
                <ul className="tree-content">
                    {node.children.map((childNode: TreeNodeType) => (
                        <TreeNodeCard
                            key={childNode.id}
                            node={childNode}
                            selectedNode={selectedNode}
                            setSelectedNode={setSelectedNode}
                            toggleAddFamilyModal={toggleAddFamilyModal}
                            toggleEditPersonModal={toggleEditPersonModal}
                            toggleConnectPersonModal={toggleConnectPersonModal}
                            handleDeletePersonNode={handleDeletePersonNode}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TreeNodeCard;
