import NextLink from "next/link";
import React from "react";
import { useSidebarContext } from "../Layout/DashboardLayoutContext";
import clsx from "clsx";
import Image from "next/image";

interface Props {
  title: string;
  icon?: React.ReactNode;
  iconPath?: string; // Path to PNG image
  isActive?: boolean;
  href?: string;
  isButton?: boolean; // Whether this item should appear as a button
  buttonColor?: 'green' | 'red' | 'blue'; // Color variants for button style
  onClick?: () => void;
}

export const SidebarItem = ({ 
  icon, 
  iconPath, 
  title, 
  isActive, 
  href = "", 
  isButton = false,
  buttonColor = 'green',
  onClick
}: Props) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    if (window.innerWidth < 768) {
      setCollapsed();
    }
  };

  const getButtonColor = () => {
    switch (buttonColor) {
      case 'red':
        return 'bg-red-500 text-white hover:bg-red-600';
      case 'blue':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'green':
      default:
        return 'bg-green-500 text-white hover:bg-green-600';
    }
  };
  
  const content = (
    <div
      className={clsx(
        isActive
          ? "bg-primary-100 [&_svg_path]:fill-primary-500"
          : isButton
            ? getButtonColor()
            : "hover:bg-default-100",
        "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]"
      )}
      onClick={handleClick}
    >
      {iconPath ? (
        <div className="w-5 h-5 flex-shrink-0">
          <Image 
            src={iconPath} 
            alt={title} 
            width={20} 
            height={20}
            className="object-contain" 
          />
        </div>
      ) : (
        icon
      )}
      <span className={clsx("text-default-900", isButton && "text-white")}>{title}</span>
    </div>
  );
  
  if (onClick) {
    return <div className="text-default-900 active:bg-none max-w-full">{content}</div>;
  }
  
  return (
    <NextLink
      href={href}
      className="text-default-900 active:bg-none max-w-full"
    >
      {content}
    </NextLink>
  );
};
