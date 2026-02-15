import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const MenuBarContainer = styled.div`
  display: flex;
  align-items: center;
  background: #f0f0f0;
  border-bottom: 1px solid #c0c0c0;
  padding: 0 4px;
  flex-shrink: 0;
  font-size: 12px;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
`;

const MenuItem = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: none;
  background: ${(p) => (p.$active ? 'rgba(0, 0, 0, 0.05)' : 'transparent')};
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: #ffffff;
  border: 1px solid #c0c0c0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  z-index: 1000;
`;

const MenuDropdownItem = styled.button<{ $disabled?: boolean }>`
  display: block;
  width: 100%;
  padding: 6px 24px 6px 12px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  font-size: 12px;
  font-family: inherit;
  color: ${(p) => (p.$disabled ? '#808080' : '#000000')};

  &:hover:not(:disabled) {
    background: #e8f4fc;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const MenuSeparator = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 4px 0;
`;

const MenuItemWrapper = styled.div`
  position: relative;
`;

export interface MenuItemDef {
  label?: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
  children?: MenuItemDef[];
}

export interface MenuDef {
  label: string;
  items: MenuItemDef[];
}

export interface MenuBarProps {
  menus: MenuDef[];
}

export const MenuBar: React.FC<MenuBarProps> = ({ menus }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMenu === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  const renderItem = (item: MenuItemDef, index: number) => {
    if (item.separator) {
      return <MenuSeparator key={index} />;
    }
    return (
      <MenuDropdownItem
        key={index}
        $disabled={item.disabled}
        disabled={item.disabled}
        onClick={() => {
          if (!item.disabled && item.onClick) {
            item.onClick();
            setActiveMenu(null);
          }
        }}
      >
        {item.label}
        {item.shortcut && (
          <span style={{ float: 'right', marginLeft: 24, color: '#808080' }}>{item.shortcut}</span>
        )}
      </MenuDropdownItem>
    );
  };

  return (
    <MenuBarContainer ref={containerRef}>
      {menus.map((menu, menuIndex) => (
        <MenuItemWrapper key={menuIndex}>
          <MenuItem
            $active={activeMenu === menuIndex}
            onClick={() => setActiveMenu(activeMenu === menuIndex ? null : menuIndex)}
          >
            {menu.label}
          </MenuItem>
          {activeMenu === menuIndex && (
            <MenuDropdown>
              {menu.items.map((item, itemIndex) => renderItem(item, itemIndex))}
            </MenuDropdown>
          )}
        </MenuItemWrapper>
      ))}
    </MenuBarContainer>
  );
};
