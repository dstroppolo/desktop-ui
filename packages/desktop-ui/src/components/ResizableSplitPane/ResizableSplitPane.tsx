import React, { useState, useCallback, useRef } from 'react';
import { ResizableSplitPaneProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import {
  SplitPaneContainer,
  LeftPane,
  ResizeHandle,
  RightPane,
} from './ResizableSplitPane.styles';

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  left,
  right,
  defaultLeftWidth = 220,
  minLeftWidth = 120,
  maxLeftWidth = 500,
  handleSize = 6,
}) => {
  const theme = useTheme();
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startX.current = e.clientX;
      startWidth.current = leftWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX.current;
        let newWidth = startWidth.current + delta;

        const maxW = containerRef.current
          ? Math.min(maxLeftWidth, containerRef.current.offsetWidth - handleSize - 100)
          : maxLeftWidth;
        newWidth = Math.max(minLeftWidth, Math.min(newWidth, maxW));

        setLeftWidth(newWidth);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [leftWidth, minLeftWidth, maxLeftWidth, handleSize]
  );

  return (
    <SplitPaneContainer ref={containerRef} $theme={theme}>
      <LeftPane $width={leftWidth}>{left}</LeftPane>
      <ResizeHandle
        $theme={theme}
        $size={handleSize}
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={leftWidth}
      />
      <RightPane>{right}</RightPane>
    </SplitPaneContainer>
  );
};
