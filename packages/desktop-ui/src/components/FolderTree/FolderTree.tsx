import React, { useState, useCallback } from 'react';
import { FolderTreeItem, FolderTreeProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import {
  FolderTreeContainer,
  FolderTreeItemRow,
  ExpandIcon,
  ItemIcon,
  ItemLabel,
} from './FolderTree.styles';

const INDENT_SIZE = 16;

function useExpandedState(
  expandedIds?: string[],
  onExpandChange?: (itemId: string, expanded: boolean) => void,
  defaultExpandedIds?: string[]
) {
  const isControlled = expandedIds !== undefined;
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? [])
  );

  const expandedSet = isControlled
    ? new Set(expandedIds ?? [])
    : internalExpanded;

  const toggleExpand = useCallback(
    (itemId: string) => {
      const currentlyExpanded = expandedSet.has(itemId);
      const newExpanded = !currentlyExpanded;

      if (!isControlled) {
        setInternalExpanded((prev) => {
          const next = new Set(prev);
          if (newExpanded) {
            next.add(itemId);
          } else {
            next.delete(itemId);
          }
          return next;
        });
      }
      onExpandChange?.(itemId, newExpanded);
    },
    [expandedSet, isControlled, onExpandChange]
  );

  return { expandedSet, toggleExpand };
}

interface FolderTreeItemProps {
  item: FolderTreeItem;
  depth: number;
  selectedId?: string;
  expandedSet: Set<string>;
  onSelect: (item: FolderTreeItem) => void;
  onToggleExpand: (itemId: string) => void;
  indentSize: number;
}

const FolderTreeItemComponent: React.FC<FolderTreeItemProps> = ({
  item,
  depth,
  selectedId,
  expandedSet,
  onSelect,
  onToggleExpand,
  indentSize,
}) => {
  const theme = useTheme();
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const expanded = expandedSet.has(item.id);
  const selected = selectedId === item.id;

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(item);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(item.id);
    }
  };

  return (
    <>
      <FolderTreeItemRow
        $theme={theme}
        $depth={depth}
        $selected={selected}
        $indentSize={indentSize}
        type="button"
        onClick={handleRowClick}
      >
        <ExpandIcon
          $theme={theme}
          $expanded={expanded}
          $hasChildren={hasChildren}
          onClick={handleExpandClick}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          ▶
        </ExpandIcon>
        <ItemIcon>{item.icon ?? '📁'}</ItemIcon>
        <ItemLabel>{item.label}</ItemLabel>
      </FolderTreeItemRow>
      {hasChildren &&
        expanded &&
        item.children!.map((child) => (
          <FolderTreeItemComponent
            key={child.id}
            item={child}
            depth={depth + 1}
            selectedId={selectedId}
            expandedSet={expandedSet}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
            indentSize={indentSize}
          />
        ))}
    </>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  items,
  selectedId,
  onSelect,
  expandedIds,
  onExpandChange,
  defaultExpandedIds,
  minWidth = 180,
}) => {
  const theme = useTheme();
  const indentSize = theme.folderTree?.indentSize ?? INDENT_SIZE;
  const { expandedSet, toggleExpand } = useExpandedState(
    expandedIds,
    onExpandChange,
    defaultExpandedIds
  );

  return (
    <FolderTreeContainer $theme={theme} $minWidth={minWidth}>
      {items.map((item) => (
        <FolderTreeItemComponent
          key={item.id}
          item={item}
          depth={0}
          selectedId={selectedId}
          expandedSet={expandedSet}
          onSelect={onSelect ?? (() => {})}
          onToggleExpand={toggleExpand}
          indentSize={indentSize}
        />
      ))}
    </FolderTreeContainer>
  );
};
