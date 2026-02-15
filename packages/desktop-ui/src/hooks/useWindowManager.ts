import { useDesktop } from '../context/DesktopContext';

export const useWindowManager = () => {
  const { windowManager } = useDesktop();
  return windowManager;
};
