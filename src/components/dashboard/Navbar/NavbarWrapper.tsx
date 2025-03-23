import { Link, Navbar, NavbarContent } from "@heroui/react";
import React from "react";
import { BurguerButton } from "./BurgerButton";
import { GithubIcon } from "../../icons/Github";
import { FeedbackIcon } from "../../icons/Feedback";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>

        <NavbarContent>
          <div className="font-bold text-xl max-md:hidden">Spotify Tracker</div>
        </NavbarContent>
        
        <NavbarContent justify="end" className="gap-4">
          <div className="flex items-center gap-2">
            <Link href="/feedback">
              <FeedbackIcon />
            </Link>
            <span className="max-md:hidden font-semibold">Feedback?</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/Feli05"
              target="_blank"
            >
              <GithubIcon />
            </Link>
            <span className="max-md:hidden font-semibold">Github</span>
          </div>
        </NavbarContent>
      </Navbar>
      {children}
    </div>
  );
};
