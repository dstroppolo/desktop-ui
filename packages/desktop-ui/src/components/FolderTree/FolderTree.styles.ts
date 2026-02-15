import styled from 'styled-components';
import { Theme } from '../../types';

const getFolderTreeTheme = (theme: Theme) =>
  theme.folderTree ?? {
    itemTextColor: theme.input?.textColor ?? '#000000',
    itemHoverBackground: theme.input?.buttonHoverBackground ?? 'rgba(0, 0, 0, 0.06)',
    itemHoverTextColor: undefined,
    itemSelectedBackground: theme.input?.calendarDaySelected ?? '#d6ebf9',
    itemSelectedTextColor: undefined,
    itemPadding: '4px 8px',
    itemFontSize: '12px',
    indentSize: 16,
    expandIconColor: '#666666',
  };

interface FolderTreeContainerProps {
  $theme: Theme;
  $minWidth?: number;
}

export const FolderTreeContainer = styled.div<FolderTreeContainerProps>`
  display: flex;
  flex-direction: column;
  min-width: ${(props) => props.$minWidth ?? 180}px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  background: ${(props) => props.$theme.window.backgroundColor};
`;

interface FolderTreeItemRowProps {
  $theme: Theme;
  $depth: number;
  $selected: boolean;
  $indentSize: number;
}

export const FolderTreeItemRow = styled.button<FolderTreeItemRowProps>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 24px;
  min-height: 24px;
  padding: 0 8px;
  padding-left: ${(props) => props.$depth * props.$indentSize + 8}px;
  border: none;
  background: ${(props) =>
    props.$selected
      ? getFolderTreeTheme(props.$theme).itemSelectedBackground
      : 'transparent'};
  color: ${(props) => {
    const t = getFolderTreeTheme(props.$theme);
    return props.$selected && t.itemSelectedTextColor
      ? t.itemSelectedTextColor
      : t.itemTextColor;
  }};
  font-size: ${(props) => getFolderTreeTheme(props.$theme).itemFontSize};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: ${(props) =>
      props.$selected
        ? getFolderTreeTheme(props.$theme).itemSelectedBackground
        : getFolderTreeTheme(props.$theme).itemHoverBackground};
    color: ${(props) => {
      const t = getFolderTreeTheme(props.$theme);
      if (t.itemHoverTextColor) return t.itemHoverTextColor;
      if (props.$selected && t.itemSelectedTextColor) return t.itemSelectedTextColor;
      return t.itemTextColor;
    }};
  }

  &:focus {
    outline: 1px dotted ${(props) => props.$theme.input?.focusBorderColor ?? '#000080'};
    outline-offset: -1px;
  }
`;

interface ExpandIconProps {
  $expanded: boolean;
  $hasChildren: boolean;
  $theme: Theme;
}

export const ExpandIcon = styled.span<ExpandIconProps>`
  width: 12px;
  height: 12px;
  min-width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.$hasChildren ? 0 : '12px')};
  color: ${(props) =>
    props.$hasChildren
      ? getFolderTreeTheme(props.$theme).expandIconColor ?? '#666666'
      : 'transparent'};
  font-size: 10px;
  transition: transform 0.15s ease;
  transform: ${(props) => (props.$expanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

export const ItemIcon = styled.span`
  width: 16px;
  height: 16px;
  min-width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

export const ItemLabel = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;
