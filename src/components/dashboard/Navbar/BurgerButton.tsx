import React from "react";
import { useSidebarContext } from "../Layout/DashboardLayoutContext";
import { StyledBurgerButton } from "./NavbarStyles";

export const BurguerButton = () => {
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <div
      className={StyledBurgerButton()}
      // open={collapsed}
      onClick={setCollapsed}
    >
      <div />
      <div />
    </div>
  );
};
