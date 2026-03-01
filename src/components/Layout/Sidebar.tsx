"use client";

import React, { HTMLProps, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface SideBarLink {
  name: string;
  label: string;
  link: string;
  children?: SideBarLink[];
}

interface SideBarListProps {
  className?: HTMLProps<HTMLElement>["className"];
  itemClassName?: HTMLProps<HTMLElement>["className"];
}

interface CollapsibleSideBarProps {
  data: any;
  pathname: string;
  itemClassName?: HTMLProps<HTMLElement>["className"];
}

// renders the entire collapsible sidebar + top portion
export const CollapsibleSideBar: React.FC<CollapsibleSideBarProps> = ({
  data,
  pathname,
  itemClassName
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const renderChildren = () => {
    return data.children.map((item: SideBarLink) => {
      const isActive = pathname.startsWith(item.link);
      return (
        <Link key={item.name} href={item.link}>
          <li
            className={`hover:bg-primary-blue-005 hover:shadow-[inset_6px_0_0_#2563CC] ${itemClassName} ${
              isActive ? "bg-blue-200" : ""
            }`}
          >
            <span style={{marginLeft: '16px'}}>{item.label}</span>
          </li>
        </Link>
      );
    });
  };

  return (
    <>
      <li
        className={`hover:bg-primary-blue-005 hover:shadow-[inset_6px_0_0_#2563CC]} ${itemClassName} font-semibold`}
        onClick={toggleExpand}
      >
        {data.label}
        <span>
          <ChevronRight
            style={{rotate: isExpanded ? '270deg' : '90deg' }}
          />
        </span>
      </li>
      {isExpanded && renderChildren()}
    </>
  );
};

export const SideBarList: React.FC<SideBarListProps> = ({
  className,
  itemClassName,
}) => {
  const pathname = usePathname();
  return (
    <ul className={`hover:cursor-pointer ${className}`}>
      {[
        { name: "menu.memory", label: "Memory game", link: "/memory-game" },
        { name: "menu.aim", label: "Aim Trainer", link: "/aim-trainer" },
        { name: "menu.maze", label: "Maze (KIV)", link: "/maze" },
        {
          name: "menu.darkest",
          label: "Darkest Companion V2",
          link: "/darkest/expedition",
          children: [
            {
              name: "menu.darkest.expedition",
              label: "Expedition log",
              link: "/darkest/expedition",
            },
            {
              name: "menu.darkest.heroes",
              label: "Heroes",
              link: "/darkest/heroes",
            },
            {
              name: "menu.darkest.enemies",
              label: "Enemies",
              link: "/darkest/enemies",
            },
            {
              name: "menu.darkest.curios",
              label: "Curios",
              link: "/darkest/curios",
            },
          ],
        },
      ].map((item: SideBarLink) => {
		if(item?.children) {
			return <CollapsibleSideBar key={item.name} data={item} pathname={pathname} itemClassName={itemClassName} />
		}
        const isActive = pathname.startsWith(item.link);
        return (
          <Link key={item.name} href={item.link}>
            <li
              className={`hover:bg-primary-blue-005 hover:shadow-[inset_6px_0_0_#2563CC] font-semibold ${itemClassName} ${
                isActive ? "bg-blue-200" : ""
              }`}
            >
              {item.label}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-white text-cool-gray-90 lg:w-56 w-36 md:flex hidden">
      {<SideBarList className="w-full" itemClassName="p-3" />}
    </aside>
  );
};

export default Sidebar;
