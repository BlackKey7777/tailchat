import React, { PropsWithChildren } from 'react';
import { useSidebarContext } from '../SidebarContext';
import _isNil from 'lodash/isNil';
import { EventTypes, useDrag, UserDragConfig } from '@use-gesture/react';
import { useIsMobile } from '@/hooks/useIsMobile';
import clsx from 'clsx';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useWatch } from 'tailchat-shared';

interface PageContentRootProps extends PropsWithChildren<ReactDOMAttributes> {
  className?: string;
  style?: React.CSSProperties;
}
const PageContentRoot: React.FC<PageContentRootProps> = ({
  className,
  style,
  children,
  ...others
}) => (
  <div
    {...others}
    style={style}
    className={clsx('flex flex-row flex-1 overflow-hidden relative', className)}
  >
    {children}
  </div>
);

const PageGestureWrapper: React.FC<PropsWithChildren> = React.memo((props) => {
  const { setShowSidebar } = useSidebarContext();

  const bind = useDrag<EventTypes['drag'], UserDragConfig>(
    (state) => {
      const { swipe } = state;
      const swipeX = swipe[0];
      if (swipeX > 0) {
        setShowSidebar(true);
      } else if (swipeX < 0) {
        setShowSidebar(false);
      }
    },
    {
      axis: 'x',
      swipe: {
        distance: 5,
      },
    }
  );

  return (
    <PageContentRoot
      style={{
        touchAction: 'pan-x',
      }}
      {...bind()}
    >
      {props.children}
    </PageContentRoot>
  );
});
PageGestureWrapper.displayName = 'PageGestureWrapper';

interface PageContentProps {
  sidebar?: React.ReactNode;
  'data-tc-role'?: string;
}
/**
 * 用于渲染实际页面的组件，即除了导航栏剩余的内容
 */
export const PageContent: React.FC<PropsWithChildren<PageContentProps>> =
  React.memo((props) => {
    const { sidebar, children } = props;
    const { showSidebar, setShowSidebar } = useSidebarContext();
    const isMobile = useIsMobile();
    useWatch([isMobile], () => {
      if (isMobile === false) {
        // 如果不为移动端, 则一定显示侧边栏
        setShowSidebar(true);
      }
    });

    const sidebarEl = _isNil(sidebar) ? null : (
      <div
        className={clsx(
          'bg-sidebar-light dark:bg-sidebar-dark flex-shrink-0 transition-width',
          isMobile ? 'w-full h-full' : 'w-60'
        )}
      >
        {props.sidebar}
      </div>
    );

    // На телефоне боковая панель и содержимое занимают один экран,
    // а не показываются рядом с горизонтальным переполнением.
    const contentEl = children;

    const el = (
      <ErrorBoundary>
        {sidebarEl}

        <div
          className={clsx(
            'flex flex-auto min-w-0 bg-content-light dark:bg-content-dark overflow-hidden',
            isMobile &&
              'transform inset-0 w-full h-full absolute transition-transform duration-200',
            isMobile && {
              'translate-x-full': showSidebar,
              'translate-x-0': !showSidebar,
            }
          )}
          data-tc-role={props['data-tc-role']}
        >
          <div className="tc-content-background" />

          <div
            className={clsx('flex relative w-full', {
              'overflow-auto': !showSidebar || !isMobile,
              'overflow-hidden': showSidebar && isMobile,
            })}
          >
            <ErrorBoundary>{contentEl}</ErrorBoundary>
          </div>
        </div>
      </ErrorBoundary>
    );

    if (isMobile) {
      return <PageGestureWrapper>{el}</PageGestureWrapper>;
    } else {
      return <PageContentRoot>{el}</PageContentRoot>;
    }
  });
PageContent.displayName = 'PageContent';
