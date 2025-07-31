/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * A sidebar component that renders a list of navigation items.
 *
 * @param {{ path: string; label: string; icon: React.ComponentType<any>; }[]} navItems
 * List of navigation items.
 * @param {boolean} [isCollapsed = false]
 * Whether the sidebar is collapsed or not.
 * @returns {React.ReactElement}
 */
export const Sidebar: React.FC<{
  navItems: {
    path: string;
    label: { uz: string; en: string; ru: string };
    icon: React.ComponentType<any>;
  }[];
  isCollapsed?: boolean;
}> = ({ navItems, isCollapsed = false }) => {
  const location = useLocation();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) =>
      location.pathname.includes(item.path)
    );
    const activeEl = itemRefs.current[activeIndex];
    const containerEl = containerRef.current;

    if (activeEl && containerEl && indicatorRef.current) {
      const activeRect = activeEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const offsetTop = activeRect.top - containerRect.top;

      indicatorRef.current.style.top = `${offsetTop}px`;
      indicatorRef.current.style.height = `${activeRect.height}px`;
    }
  }, [location.pathname, navItems]);
  const { t } = useTranslation();
  return (
    <nav className="flex-1 px-4 py-6">
      <div className="relative space-y-2" ref={containerRef}>
        {/* Dinamik Background (lekin ref orqali boshqariladi) */}
        <div
          ref={indicatorRef}
          className="absolute left-0 w-full bg-gradient-to-br from-[#62d17a] to-[#138d2e] rounded-lg z-0 transition-all duration-300"
          style={{ top: 0, height: 0 }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);

          return (
            <div
              key={index}
              className="relative z-10"
              ref={(el) =>
                (itemRefs.current[index] =
                  el as HTMLDivElement) as unknown as undefined
              }
            >
              <NavLink to={item.path}>
                <div
                  className={`flex items-center gap-4 px-4 py-3 min-h-[46px] rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0 ml-1" />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap">
                      {t(item.label)}
                    </span>
                  )}
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
