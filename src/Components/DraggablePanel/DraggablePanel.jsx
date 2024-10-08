import React, { useRef, useEffect, useCallback } from 'react';
import styles from './DraggablePanel.module.css';
import useStore from 'store/UseStore';

const DraggablePanel = ({ children }) => {
  const { footerHeight, minHeight, midHeight, maxHeight, tabHeight, setTabHeight, updateMapHeight } = useStore();
  const panelRef = useRef(null);
  const handleRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const isDragging = useRef(false);

  const handleDragStart = useCallback((clientY) => {
    isDragging.current = true;
    dragStartY.current = clientY;
    dragStartHeight.current = tabHeight;
  }, [tabHeight]);

  const handleDrag = useCallback((clientY) => {
    if (!isDragging.current) return;
    const delta = dragStartY.current - clientY;
    let newHeight = dragStartHeight.current + delta;
    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    setTabHeight(newHeight);
    updateMapHeight();
  }, [minHeight, maxHeight, setTabHeight, updateMapHeight]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const snapPositions = [minHeight, midHeight, maxHeight];
    const closestPosition = snapPositions.reduce((prev, curr) =>
      Math.abs(curr - tabHeight) < Math.abs(prev - tabHeight) ? curr : prev
    );
    setTabHeight(closestPosition);
    updateMapHeight();
  }, [minHeight, midHeight, maxHeight, tabHeight, setTabHeight, updateMapHeight]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;

    let lastCallTime = 0;
    const throttleInterval = 16; // ~60fps

    const throttledHandleDrag = (clientY) => {
      const now = Date.now();
      if (now - lastCallTime >= throttleInterval) {
        handleDrag(clientY);
        lastCallTime = now;
      }
    };

    const handleTouchStart = (e) => {
      e.preventDefault(); // Prevent scrolling when starting drag
      handleDragStart(e.touches[0].clientY);
    };
    const handleTouchMove = (e) => {
      e.preventDefault(); // Prevent scrolling during drag
      throttledHandleDrag(e.touches[0].clientY);
    };
    const handleMouseDown = (e) => {
      e.preventDefault(); // Prevent default selection
      handleDragStart(e.clientY);
    };

    handle.addEventListener('touchstart', handleTouchStart, { passive: false });
    handle.addEventListener('mousedown', handleMouseDown);

    const handleGlobalTouchMove = (e) => {
      if (isDragging.current) {
        throttledHandleDrag(e.touches[0].clientY);
      }
    };
    const handleGlobalMouseMove = (e) => {
      if (isDragging.current) {
        throttledHandleDrag(e.clientY);
      }
    };

    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('touchend', handleDragEnd);
    window.addEventListener('mouseup', handleDragEnd);

    return () => {
      handle.removeEventListener('touchstart', handleTouchStart);
      handle.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragStart, handleDrag, handleDragEnd]);

  return (
    <div
      ref={panelRef}
      className={styles.draggablePanelContainer}
      style={{
        height: `${tabHeight}px`,
        transition: isDragging.current ? 'none' : 'height 0.3s ease-out',
        bottom: `${footerHeight}px`,
      }}
    >
      <div ref={handleRef} className={styles.draggableHandler}>
        <div className={styles.draggableIcon}></div>
      </div>
      <div className={styles.draggablePanelContent}>
        {children}
      </div>
    </div>
  );
};

export default DraggablePanel;