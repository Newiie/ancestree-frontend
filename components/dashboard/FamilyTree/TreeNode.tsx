"use client";

import React from 'react';
import Image from 'next/image';
import { InfoIcon, PencilIcon, PlusIcon, UserRoundIcon } from 'lucide-react';
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
        <li key={node.personNodeId}>
            <a
                href="#"
                className='relative'
                onClick={() => setSelectedNode(node.personNodeId)}
            >
                <Image src={`${node?.person?.profilePicture || FALLBACK_AVATAR}`} alt={`${node?.person?.generalInformation?.firstName ?? node?.person?.generalInformation?.firstname} ${node?.person?.generalInformation?.lastName ?? node?.person?.generalInformation?.lastname}`} width={100} height={100} />
                <span>
                     {node?.person?.generalInformation?.firstName ?? node?.person?.generalInformation?.firstname}
                     {" "}
                     {node?.person?.generalInformation?.lastName ?? node?.person?.generalInformation?.lastname}
                </span>

                {selectedNode === node.personNodeId && (
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
                                <SheetContent>
                                    <SheetHeader>
                                    <SheetTitle>Person Information: </SheetTitle>
                                    <SheetDescription>
                                        Overview of personal and family details.
                                    </SheetDescription>
                                    </SheetHeader>
                                    <div>
                                        <p className='pt-4'>
                                            Name:
                                            <span className='pl-2 text-[#7C7C7C]'>
                                                {node?.person?.generalInformation?.firstName}
                                                {" "}
                                                {node?.person?.generalInformation?.middleName}
                                                {" "}
                                                {node?.person?.generalInformation?.lastName}
                                                {" "}
                                                {node?.person?.generalInformation?.suffix}
                                            </span>
                                        </p>
                                        {
                                            node?.person?.vitalInformation?.sex && (
                                                <>

                                                    <p>
                                                        Sex:
                                                        <span className='pl-2 text-[#7C7C7C]'>
                                                        {capitalizeFirstLetter(node?.person?.vitalInformation?.sex ?? '')}
                                                        </span>
                                                    </p>
                                                </>
                                            )
                                        }
                                        {
                                            node?.person?.generalInformation?.status && (
                                                <>

                                                    <p>
                                                        Status:
                                                        <span className='pl-2 text-[#7C7C7C]'>
                                                            {capitalizeFirstLetter(node?.person?.generalInformation?.status ?? '')}
                                                        </span>
                                                    </p>
                                                </>
                                            )
                                        }
                                        {
                                            node?.person?.generalInformation?.birthPlace && (
                                                <>

                                                    <p>
                                                        Birth Place:
                                                        <span className='pl-2 text-[#7C7C7C]'>
                                                            {capitalizeFirstLetter(node?.person?.generalInformation?.birthPlace ?? '')}
                                                        </span>
                                                    </p>
                                                </>
                                            )
                                        }


                                        {
                                            node?.person?.generalInformation?.birthCountry && (
                                                <>

                                                    <p>
                                                        Birth Country:
                                                        <span className='pl-2 text-[#7C7C7C]'>
                                                            {capitalizeFirstLetter(node?.person?.generalInformation?.birthCountry ?? '')}
                                                        </span>
                                                    </p>
                                                </>
                                            )
                                        }


                                        {(node?.person?.generalInformation?.nationality?.length ?? 0) > 0 && (
                                            <>

                                                <div>
                                                    <p>
                                                        Nationality:
                                                    </p>
                                                    {node?.person?.generalInformation?.nationality?.map((nationality: string) => (
                                                        <span className='pl-4 text-[#7C7C7C]' key={nationality}>{capitalizeFirstLetter(nationality)}</span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                        {
                                            node?.person?.generalInformation?.birthdate && (
                                                <>

                                                    <p>
                                                        Birth Date:
                                                        <span className='pl-2 text-[#7C7C7C]'>
                                                            {node?.person?.generalInformation?.birthdate.slice(0, 10)}
                                                        </span>
                                                    </p>
                                                </>
                                            )
                                        }


                                        {
                                            (node?.parents?.length ?? 0) > 0 && (
                                                <>

                                                    <p>
                                                        Parents:
                                                    </p>
                                                    {node?.parents?.map((parent: TreeNodeType, index: number) => (
                                                        <p className='pl-4 text-[#7C7C7C]' key={parent.personNodeId ?? index}>
                                                            {capitalizeFirstLetter(parent.person?.generalInformation?.firstName ?? '')}
                                                            {" "}
                                                            {capitalizeFirstLetter(parent.person?.generalInformation?.middleName ?? '')}
                                                            {" "}
                                                            {capitalizeFirstLetter(parent.person?.generalInformation?.lastName ?? '')}
                                                        </p>
                                                    ))}
                                                </>
                                            )
                                        }

                                        {(currentUserId === userId) &&<button
                                        className='mt-4 bg-white hover:bg-red-50 text-red-500 border border-red-300 px-4 py-1 rounded-[3px]'
                                        onClick={() => {
                                            handleDeletePersonNode()
                                        }}
                                        >
                                            Delete Person
                                        </button>}
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
                            key={childNode.personNodeId}
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
