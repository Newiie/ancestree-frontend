import React, { useState, useRef } from 'react';
import Image from 'next/image';
import '@/public/style/familytree.css';
import { InfoIcon, PencilIcon, PlusIcon, UserRoundIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useModal } from '@/hooks/ModalContext';
import { motion, AnimatePresence } from 'framer-motion';

const Node = ({ node, selectedNode, setSelectedNode, toggleAddFamilyModal, toggleEditPersonModal }: any) => {
    const [isHover, setIsHover] = useState(false);

    return (
        <li key={node.id}>
            <a 
                href="#" 
                className='relative'
   
                onClick={() => setSelectedNode(node.id)}
            >
                <Image src={`/images/familytree/${node.id}.jpg`} alt={node.name} width={100} height={100} />
                <span>{node.name}</span>

                {selectedNode === node.id && (
                    <div className='absolute top-0 -right-[40px] z-10'>
                        <div className='relative flex flex-col gap-1'>
                            <button
                                onClick={() => toggleAddFamilyModal()}
                                className='absolute top-0 right-[2px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <PlusIcon size={16} />
                            </button>

                            <button
                                onClick={() => console.log("View")}
                                className='absolute top-[31px] right-[-14px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <UserRoundIcon size={16} />
                            </button>

                            <button
                                onClick={() => toggleEditPersonModal()}
                                className='absolute top-[67px] right-[-14px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <PencilIcon size={16} />
                            </button>

                            <button
                                onClick={() => console.log("Info")}
                                onMouseEnter={() => setIsHover(true)}
                                onMouseLeave={() => setIsHover(false)}
                                className='absolute top-[98px] right-[1px] bg-white-500 border border-[#E0E0E0] hover:bg-gray-100 text-[#7C7C7C] px-2 py-1 rounded-[50%] w-8 h-8 flex items-center justify-center'
                            >
                                <InfoIcon size={16} />
                            </button>

                            {isHover &&
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
                            }
                        </div>
                    </div>
                )}
            </a>

            {/* Render children nodes */}
            {node.children && node.children.length > 0 && (
                <ul className="tree-content">
                    {node.children.map((childNode: any) => (
                        <Node 
                            key={childNode.id}
                            node={childNode}
                            selectedNode={selectedNode}
                            setSelectedNode={setSelectedNode}
                            toggleAddFamilyModal={toggleAddFamilyModal}
                            toggleEditPersonModal={toggleEditPersonModal}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};


const Content = () => {

    const {toggleAddFamilyModal, treeData, selectedNode, setSelectedNode, toggleEditPersonModal} = useModal();

    const [zoomLevel, setZoomLevel] = useState(1);
    const treeContainerRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
 





    const renderTree = (nodes: any) => (
        <ul className='tree-content'>
            {nodes.map((node: any) =>  (
                <Node 
                    key={node.id}
                    node={node}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    toggleAddFamilyModal={toggleAddFamilyModal}
                    toggleEditPersonModal={toggleEditPersonModal}
                />
            ))}
        </ul>
    );

    const zoomIn = () => {
        setZoomLevel(zoomLevel + 0.1);
    };

    const zoomOut = () => {
        if (zoomLevel > 0.1) {
            setZoomLevel(zoomLevel - 0.1);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        if(!treeContainerRef.current) return;
        setStartX(e.pageX - treeContainerRef.current.offsetLeft);
        setStartY(e.pageY - treeContainerRef.current.offsetTop);
        setScrollLeft(treeContainerRef.current.scrollLeft);
        setScrollTop(treeContainerRef.current.scrollTop);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !treeContainerRef.current) return;
        e.preventDefault();
        if (treeContainerRef.current) {
            const x = e.pageX - treeContainerRef.current.offsetLeft;
            const y = e.pageY - treeContainerRef.current.offsetTop;
            const walkX = (x - startX);
            const walkY = (y - startY);
            treeContainerRef.current.scrollLeft = scrollLeft - walkX;
            treeContainerRef.current.scrollTop = scrollTop - walkY;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className='relative'>
            <div className="absolute rounded-[10px] top-0 right-[10px] m-2 bg-white-500 border border-[#E0E0E0] bg-white hover:bg-gray-100 text-[#7C7C7C] flex items-center justify-center z-10">
                <button className='p-2' onClick={zoomIn}><ZoomInIcon size={32} /></button>
                <button className='p-2' onClick={zoomOut}><ZoomOutIcon size={32} /></button>
            </div>
            <div
                className="tree-container"
                ref={treeContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} 
            >
                <div className="tree" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
                    {renderTree(treeData)}
                </div>
            </div>
            
        </div>
    );
};

export default Content;
