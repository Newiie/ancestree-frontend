import React, { useState, useRef, useEffect } from 'react';
import '@/public/style/familytree.css';
import { ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useTree } from '@/providers/TreeProvider';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '@/lib/constants';
import { TreeNode } from '@/types/tree';
import TreeNodeCard from '@/components/dashboard/FamilyTree/TreeNode';

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
                <TreeNodeCard
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
