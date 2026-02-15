import { Theme } from '../types';

export const windowsXPTheme: Theme = {
  desktop: {
    // Windows XP "Bliss" wallpaper - green hill and blue sky
    background: 'linear-gradient(to bottom, #87ceeb 0%, #5cb3cc 30%, #4a9bc4 60%, #3a7ba5 100%)',
  },
  window: {
    backgroundColor: '#f0f0f0', // Light gray/off-white window background
    borderColor: '#7db4e6', // Light blue border
    borderWidth: '1px',
    borderRadius: '6px', // Rounded corners, especially top corners
    shadow: '2px 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)', // Subtle shadow with slight border effect
    header: {
      height: '30px',
      // Authentic XP title bar gradient: lighter sky blue at top to medium blue at bottom
      backgroundColor: 'linear-gradient(to bottom, #7db4e6 0%, #5a9bd4 50%, #3a6ea5 100%)',
      textColor: '#ffffff',
      fontSize: '11px',
      fontWeight: 'bold',
      padding: '6px 10px',
    },
    button: {
      size: '21px', // Slightly larger buttons like XP
      borderRadius: '0px', // Square buttons
      hoverBackground: 'rgba(255, 255, 255, 0.1)',
      activeBackground: 'rgba(0, 0, 0, 0.1)',
      closeColor: '#000000', // Black X on gray button
      closeHoverColor: '#ffffff', // White X on red background when hovered
      minimizeColor: '#000000',
      minimizeHoverColor: '#000000',
      maximizeColor: '#000000',
      maximizeHoverColor: '#000000',
    },
  },
  taskbar: {
    height: '30px',
    // Taskbar gradient: medium blue, darker at bottom
    backgroundColor: 'linear-gradient(to bottom, #245edb 0%, #1941a5 50%, #0f2d7a 100%)',
    borderTop: '1px solid #0a1f5c',
    item: {
      // Inactive taskbar buttons: transparent/dark blue
      backgroundColor: 'transparent',
      // Hover: lighter blue
      hoverBackground: 'rgba(255, 255, 255, 0.15)',
      // Active: lighter blue with 3D highlight effect
      activeBackground: 'linear-gradient(to bottom, #5a9bd4 0%, #3a6ea5 50%, #2a5a8a 100%)',
      textColor: '#ffffff',
      fontSize: '11px',
      padding: '6px 16px',
      borderRadius: '4px', // Rounded corners on taskbar buttons
    },
    startButton: {
      // Windows XP: Green gradient start button
      backgroundColor: 'linear-gradient(to bottom, #7cb800 0%, #6ba300 50%, #5a8f00 100%)',
      hoverBackground: 'linear-gradient(to bottom, #8cc800 0%, #7bb300 50%, #6a9f00 100%)',
      activeBackground: 'linear-gradient(to bottom, #6ba300 0%, #5a8f00 50%, #4a7b00 100%)',
      textColor: '#ffffff',
      fontSize: '14px',
      fontWeight: 'bold',
      padding: '0 12px',
      borderRadius: '10px',
      minWidth: '90px',
      logoColors: {
        color1: '#0078d4', // Windows XP logo blue
        color2: '#00a4ef', // Windows XP logo light blue
      },
    },
  },
  startMenu: {
    backgroundColor: '#f0f0f0',
    borderColor: '#7db4e6',
    borderWidth: '1px',
    borderRadius: '6px',
    shadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
    itemTextColor: '#000000',
    itemHoverBackground: 'linear-gradient(to bottom, #e8f4fc 0%, #d6ebf9 100%)',
    itemPadding: '8px 24px 8px 12px',
    itemFontSize: '12px',
    minWidth: '220px',
  },
  folderTree: {
    itemTextColor: '#000000',
    itemHoverBackground: 'rgba(0, 120, 212, 0.1)',
    itemSelectedBackground: '#d6ebf9',
    itemPadding: '4px 8px',
    itemFontSize: '12px',
    indentSize: 16,
    expandIconColor: '#666666',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#7f9db9',
    borderWidth: '1px',
    borderRadius: '4px',
    textColor: '#000000',
    placeholderColor: '#7f9db9',
    focusBorderColor: '#0078d4',
    disabledBackground: '#f0f0f0',
    disabledTextColor: '#7f9db9',
    errorBorderColor: '#cc0000',
    checkColor: '#000000',
    checkBackground: '#ffffff',
    buttonBackground: 'linear-gradient(to bottom, #ece9d8 0%, #d6d3c8 50%, #d0ccbb 100%)',
    buttonHoverBackground: 'linear-gradient(to bottom, #fffbf0 0%, #e8e4d5 50%, #d6d3c8 100%)',
    buttonActiveBackground: 'linear-gradient(to bottom, #d0ccbb 0%, #c5c2b0 100%)',
    buttonBorderColor: '#7f9db9',
    buttonTextColor: '#000000',
    buttonDisabledBackground: '#f0f0f0',
    buttonSecondaryBackground: 'linear-gradient(to bottom, #e8e4d5 0%, #d6d3c8 100%)',
    buttonSecondaryHoverBackground: 'linear-gradient(to bottom, #f5f2e8 0%, #e8e4d5 100%)',
    buttonDangerBackground: 'linear-gradient(to bottom, #e8a0a0 0%, #d08080 100%)',
    buttonDangerHoverBackground: 'linear-gradient(to bottom, #f0b0b0 0%, #e09090 100%)',
    calendarBackground: '#ffffff',
    calendarHeaderBackground: 'linear-gradient(to bottom, #7db4e6 0%, #5a9bd4 100%)',
    calendarDayHover: '#d6ebf9',
    calendarDaySelected: '#0078d4',
  },
};
