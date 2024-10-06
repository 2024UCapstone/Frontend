import React, { useState, useRef, useEffect } from 'react';
import styles from './ScrollHandler.module.css';

const ScrollHandler = ({ children }) => {
  const [tabHeight, setTabHeight] = useState(window.innerHeight * 0.118);
  const tabRef = useRef(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const isDragging = useRef(false);

  const minHeight = window.innerHeight * 0.118;
  const midHeight = window.innerHeight * 0.5;
  const maxHeight = window.innerHeight * 0.93;

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
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    
    // Snap to nearest position
    const snapPositions = [
      minHeight,
      window.innerHeight * 0.5,
      maxHeight
    ];
    
    const closestPosition = snapPositions.reduce((prev, curr) => 
      Math.abs(curr - tabHeight) < Math.abs(prev - tabHeight) ? curr : prev
    );
    
    setTabHeight(closestPosition);
  };

  // Touch event handlers
  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientY);
  const handleTouchMove = (e) => handleDrag(e.touches[0].clientY);
  const handleTouchEnd = () => handleDragEnd();

  // Mouse event handlers
  const handleMouseDown = (e) => handleDragStart(e.clientY);
  const handleMouseMove = (e) => handleDrag(e.clientY);
  const handleMouseUp = () => handleDragEnd();

  useEffect(() => {
    if (isDragging.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging.current]);

  useEffect(() => {
    const handleResize = () => {
      setTabHeight(prevHeight => {
        const ratio = prevHeight / window.innerHeight;
        return window.innerHeight * ratio;
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={tabRef}
      className={styles.tabContainer}
      style={{
        height: `${tabHeight}px`,
        transition: isDragging.current ? 'none' : 'height 0.3s ease-out',
      }}
    >
      <div 
        className={styles.dragHandle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.dragIcon}></div>
      </div>
      <div className={styles.tabContent}>
        {children}
      </div>
    </div>
  );
};

export default ScrollHandler;