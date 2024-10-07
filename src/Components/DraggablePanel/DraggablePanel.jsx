import React, { useRef, useEffect } from 'react';
import styles from './DraggablePanel.module.css';
import useStore from 'store/UseStore';

const DraggablePanel = ({ children }) => {
  const { tabHeight, setTabHeight, updateMapHeight } = useStore();
  const panelRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const isDragging = useRef(false);

  const minHeight = window.innerHeight * 0.1;
  const midHeight = window.innerHeight * 0.5;
  const maxHeight = window.innerHeight * 0.9;

  const handleDragStart = (clientY) => {
    isDragging.current = true;
    dragStartY.current = clientY;
    dragStartHeight.current = tabHeight;
  };

  const handleDrag = (clientY) => {
    if (!isDragging.current) return;
    
    const delta = dragStartY.current - clientY;
    let newHeight = dragStartHeight.current + delta;
    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    
    setTabHeight(newHeight);
    updateMapHeight();
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    
    // Snap to nearest position
    const snapPositions = [minHeight, midHeight, maxHeight];
    const closestPosition = snapPositions.reduce((prev, curr) => 
      Math.abs(curr - tabHeight) < Math.abs(prev - tabHeight) ? curr : prev
    );
    
    setTabHeight(closestPosition);
    updateMapHeight();
  };

  // Touch event handlers
  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDrag(e.touches[0].clientY);
  };
  const handleTouchEnd = () => handleDragEnd();

  // Mouse event handlers
  const handleMouseDown = (e) => handleDragStart(e.clientY);
  const handleMouseMove = (e) => {
    if (isDragging.current) {
      e.preventDefault();
      handleDrag(e.clientY);
    }
  };
  const handleMouseUp = () => handleDragEnd();

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging.current) {
        handleDrag(e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        handleDragEnd();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className={styles.draggablePanelContainer}
      style={{
        height: `${tabHeight}px`,
        transition: isDragging.current ? 'none' : 'height 0.3s ease-out',
      }}
    >
      <div 
        className={styles.draggableHandle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.draggableIcon}></div>
      </div>
      <div className={styles.draggablePanelContent}>
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;