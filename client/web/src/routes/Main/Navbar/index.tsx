import React from 'react';
import { GroupNav } from './GroupNav';
import { MobileMenuBtn } from './MobileMenuBtn';
import { SettingBtn } from './SettingBtn';
import { Divider } from 'antd';
import { PersonalNav } from './PersonalNav';
import { InboxNav } from './InboxNav';
import { InstallBtn } from './InstallBtn';
import { ReactQueryDevBtn } from './ReactQueryDevBtn';
import { pluginCustomPanel } from '@/plugin/common';
import { NavbarCustomNavItem } from './CustomNavItem';
import { QuickSwitcherNav } from './QuickSwitcherNav';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * Навигация KIVO: вертикальная на десктопе, нижняя панель на телефонах.
 */
export const Navbar: React.FC = React.memo(() => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <nav
        data-tc-role="navbar"
        aria-label="Основная навигация"
        className="kivo-bottom-nav"
      >
        <div className="kivo-bottom-nav-item">
          <PersonalNav />
          <span className="kivo-bottom-nav-label">Личное</span>
        </div>
        <div className="kivo-bottom-nav-item">
          <InboxNav />
          <span className="kivo-bottom-nav-label">Входящие</span>
        </div>
        <div className="kivo-bottom-nav-item">
          <QuickSwitcherNav />
          <span className="kivo-bottom-nav-label">Поиск</span>
        </div>
        <div className="kivo-bottom-nav-item">
          <SettingBtn />
          <span className="kivo-bottom-nav-label">Настройки</span>
        </div>
      </nav>
    );
  }

  return (
    <div
      data-tc-role="navbar"
      className="w-18 mobile:zoom-4/5 bg-navbar-light dark:bg-navbar-dark flex flex-col justify-start items-center pt-4 pb-4"
    >
      <MobileMenuBtn />
      <div className="flex-1 w-full overflow-hidden flex flex-col">
        <div className="space-y-2">
          <PersonalNav />
          <InboxNav />
          <QuickSwitcherNav />
          {pluginCustomPanel
            .filter((p) => p.position === 'navbar-personal')
            .map((p) => (
              <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={true} />
            ))}
        </div>
        <div className="px-3"><Divider /></div>
        <div className="overflow-y-hidden hover:overflow-y-smart scroll overflow-x-hidden thin-scrollbar">
          <GroupNav />
        </div>
      </div>
      <div
        data-tc-role="navbar-settings"
        className="flex flex-col items-center space-y-2 pt-3"
      >
        {pluginCustomPanel
          .filter((p) => p.position === 'navbar-more')
          .map((p) => (
            <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={false} />
          ))}
        <ReactQueryDevBtn />
        <InstallBtn />
        <SettingBtn />
      </div>
    </div>
  );
});
Navbar.displayName = 'Navbar';
