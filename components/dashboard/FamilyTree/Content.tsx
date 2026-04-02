import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import '@/public/style/familytree.css';
import { InfoIcon, PencilIcon, PlusIcon, UserRoundIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useTree } from '../../../providers/TreeProvider';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { selectId } from '@/store/userSlice';
import store from '@/store/store';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP, FALLBACK_AVATAR } from '@/lib/constants';
import { TreeNode } from '@/types/tree';

interface NodeProps {
  node: TreeNode;
  selectedNode: string;
  setSelectedNode: (id: string) => void;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  toggleConnectPersonModal: () => void;
  handleDeletePersonNode: () => Promise<void>;
}

const Node = ({
    node,
    selectedNode,
    setSelectedNode,
    toggleAddFamilyModal,
    toggleEditPersonModal,
    toggleConnectPersonModal,
    handleDeletePersonNode
}: NodeProps) => {
    const router = useRouter();
    const { userId } = useTree();
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
                <Image src={`${node?.person?.profilePicture || FALLBACK_AVATAR}`} alt= {`${node?.person?.generalInformation?.firstname} ${node?.person?.generalInformation?.lastname}`} width={100} height={100} />
                <span>
                     {node?.person?.generalInformation?.firstname}
                     {node?.person?.generalInformation?.firstName}
                     {" "}
                     {node?.person?.generalInformation?.lastName}
                     {node?.person?.generalInformation?.lastname}
                </span>

                {selectedNode === node.personNodeId && (
                    <div className='absolute top-0 -right-[40px] z-10'>
                        <div className='relative flex flex-col gap-1'>
                            <button
                                onClick={() => {
                                    if (selectId(store.getState()) !== userId) return;
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
                                    if (selectId(store.getState()) !== userId) return;
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
                                                    {node?.parents?.map((parent: TreeNode, index: number) => (
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

                                        {(selectId(store.getState()) === userId) &&<button 
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
                    {node.children.map((childNode: TreeNode) => (
                        <Node 
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

const Content = () => {

    const {
        toggleAddFamilyModal,
        treeData, 
        selectedNode, 
        setSelectedNode, 
        toggleEditPersonModal, 
        toggleConnectPersonModal,
        handleDeletePersonNode
    } = useTree();

    const treeContainerRef = useRef<HTMLDivElement | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const zoomRef = useRef(1);
    const isDragging = useRef(false);
    const lastPointer = useRef({ x: 0, y: 0 });
    const lastTouchDist = useRef<number | null>(null);

    const updateZoom = (newZoom: number) => {
      zoomRef.current = newZoom;
      setZoom(newZoom);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('button, a')) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const renderTree = (nodes: TreeNode[]) => (
        <ul className='tree-content'>
            {nodes.map((node: TreeNode) =>  (
                <Node 
                    key={node.personNodeId}
                    node={node}
                    selectedNode={selectedNode}
                    setSelectedNode={setSelectedNode}
                    toggleAddFamilyModal={toggleAddFamilyModal}
                    toggleEditPersonModal={toggleEditPersonModal}
                    toggleConnectPersonModal={toggleConnectPersonModal}
                    handleDeletePersonNode={handleDeletePersonNode}
                />
            ))}
        </ul>
    );

    const zoomToward = (nextZoom: number) => {
      const el = treeContainerRef.current;
      if (!el) return;
      const cx = el.clientWidth / 2;
      const cy = el.clientHeight / 2;
      const currentZoom = zoomRef.current;
      setPan(prev => ({
        x: cx - (cx - prev.x) * (nextZoom / currentZoom),
        y: cy - (cy - prev.y) * (nextZoom / currentZoom),
      }));
      updateZoom(nextZoom);
    };

    const zoomIn  = () => zoomToward(Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
    const zoomOut = () => zoomToward(Math.max(MIN_ZOOM, zoom - ZOOM_STEP));

    useEffect(() => {
      const el = treeContainerRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const rect = el.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const currentZoom = zoomRef.current;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * delta));
        updateZoom(newZoom);
        setPan(prev => ({
          x: cursorX - (cursorX - prev.x) * (newZoom / currentZoom),
          y: cursorY - (cursorY - prev.y) * (newZoom / currentZoom),
        }));
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }, []);

    useEffect(() => {
      const el = treeContainerRef.current;
      if (!el) return;

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging.current = true;
          lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
          isDragging.current = false;
          const dx = e.touches[1].clientX - e.touches[0].clientX;
          const dy = e.touches[1].clientY - e.touches[0].clientY;
          lastTouchDist.current = Math.hypot(dx, dy);
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1 && isDragging.current) {
          const dx = e.touches[0].clientX - lastPointer.current.x;
          const dy = e.touches[0].clientY - lastPointer.current.y;
          lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
          const rect = el.getBoundingClientRect();
          const dx = e.touches[1].clientX - e.touches[0].clientX;
          const dy = e.touches[1].clientY - e.touches[0].clientY;
          const newDist = Math.hypot(dx, dy);
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
          const scale = newDist / lastTouchDist.current;
          const currentZoom = zoomRef.current;
          const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, currentZoom * scale));
          updateZoom(newZoom);
          setPan(prev => ({
            x: midX - (midX - prev.x) * (newZoom / currentZoom),
            y: midY - (midY - prev.y) * (newZoom / currentZoom),
          }));
          lastTouchDist.current = newDist;
        }
      };

      const onTouchEnd = () => {
        isDragging.current = false;
        lastTouchDist.current = null;
      };

      el.addEventListener('touchstart', onTouchStart, { passive: false });
      el.addEventListener('touchmove',  onTouchMove,  { passive: false });
      el.addEventListener('touchend',   onTouchEnd);
      return () => {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove',  onTouchMove);
        el.removeEventListener('touchend',   onTouchEnd);
      };
    }, []);

    return (
        <div className='relative h-full'>
            <div className="absolute rounded-[10px] top-0 right-[10px] m-2 bg-white-500 border border-[#E0E0E0] bg-white hover:bg-gray-100 text-[#7C7C7C] flex items-center justify-center z-10">
                <button className='p-2' onClick={zoomIn}><ZoomInIcon size={32} /></button>
                <button className='p-2' onClick={zoomOut}><ZoomOutIcon size={32} /></button>
            </div>
            <div
                className="tree-container"
                ref={treeContainerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div 
                    className="tree" 
                    style={{
                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                        transformOrigin: '0 0',
                        width: 'max-content',
                        transition: isDragging.current ? 'none' : undefined,
                    }}
                >
                    {renderTree(treeData)}
                </div>
            </div>
            
        </div>
    );
};

export default Content;
