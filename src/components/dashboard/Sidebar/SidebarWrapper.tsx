import React, { useEffect, useState } from "react";
import { Sidebar } from "./SidebarStyles";
import { useSidebarContext } from "../Layout/DashboardLayoutContext";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./SidebarItem";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { SidebarMenu } from "./SidebarMenu";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTheme } from "next-themes";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const router = useRouter();
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const {resolvedTheme} = useTheme();
  const [logoSrc, setLogoSrc] = useState("/spotify_logo_dark.jpg");
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update logo source based on theme, but only after component has mounted
  useEffect(() => {
    if (mounted) {
      setLogoSrc(resolvedTheme === "dark" ? "/spotify_logo_light.jpg" : "/spotify_logo_dark.jpg");
    }
  }, [resolvedTheme, mounted]);

  // Check if user is connected to Spotify
  useEffect(() => {
    const checkSpotifyConnection = async () => {
      try {
        setIsCheckingConnection(true);
        const response = await fetch('/api/spotify/connection-status');
        
        if (response.ok) {
          const data = await response.json();
          setIsSpotifyConnected(data.connected);
        }
      } catch (err) {
        console.error("Error checking Spotify connection:", err);
      } finally {
        setIsCheckingConnection(false);
      }
    };
    
    checkSpotifyConnection();
  }, []);

  const handleConnectSpotify = async () => {
    try {
      const response = await fetch('/api/spotify/connect');
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error connecting to Spotify:", err);
      alert("Failed to connect to Spotify");
    }
  };

  const handleDisconnectSpotify = async () => {
    try {
      if (window.confirm("Are you sure you want to disconnect your Spotify account? This will remove access to your Spotify data.")) {
        const response = await fetch('/api/spotify/disconnect', {
          method: 'POST',
        });
        
        if (response.ok) {
          setIsSpotifyConnected(false);
          // Force a page refresh to update all components
          window.location.reload();
        } else {
          throw new Error("Failed to disconnect");
        }
      }
    } catch (err) {
      console.error("Error disconnecting from Spotify:", err);
      alert("Failed to disconnect from Spotify");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      
      // Call the logout API endpoint
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      // Redirect to login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Show error message to user
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <aside className="h-screen z-20 sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            {/* Logo/App Name */}
            <div className="flex items-center gap-2 px-4 py-4 mb-6">
              <div className={`${collapsed ? "w-10 h-10" : "w-8 h-8"} flex-shrink-0`}>
                {mounted && (
                  <Image 
                    src={logoSrc}
                    alt="Spotify Logo" 
                    width={collapsed ? 40 : 32} 
                    height={collapsed ? 40 : 32}
                    className="rounded-md object-contain"
                  />
                )}
              </div>
              {<span className="font-bold text-xl flex-shrink-0 md:block">Spotify Tracker</span>}
            </div>
            
            {/* Main Navigation */}
            <SidebarMenu title="Main">
              <SidebarItem
                title="New Recommendations"
                isActive={pathname === "/dashboard"}
                href="/dashboard"
              />
              
              <SidebarItem
                title="Monthly Recap"
                isActive={pathname === "/dashboard/monthly-recap"}
                href="/dashboard/monthly-recap"
              />
            </SidebarMenu>
            
            {/* Data Analysis */}
            <SidebarMenu title="Analytics">
              <SidebarItem
                title="Top Artists"
                isActive={pathname === "/dashboard/top-artists"}
                href="/dashboard/top-artists"
              />
              
              <SidebarItem
                title="Top Tracks"
                isActive={pathname === "/dashboard/top-tracks"}
                href="/dashboard/top-tracks"
              />
              
              <SidebarItem
                title="Quick Stats"
                isActive={pathname === "/dashboard/quick-stats"}
                href="/dashboard/quick-stats"
              />
            </SidebarMenu>
            
            {/* Account and Settings */}
            <SidebarMenu title="Account">
              {isCheckingConnection ? (
                <div className="px-4 py-2 text-gray-400">
                  Checking Spotify status...
                </div>
              ) : isSpotifyConnected ? (
                <SidebarItem
                  title="Disconnect Spotify"
                  isActive={false}
                  isButton={true}
                  buttonColor="red"
                  onClick={handleDisconnectSpotify}
                />
              ) : (
                <SidebarItem
                  title="Connect to Spotify"
                  isActive={false}
                  isButton={true}
                  buttonColor="green"
                  onClick={handleConnectSpotify}
                />
              )}
              
              <SidebarItem
                title="Logout"
                isButton={false}
                onClick={handleLogout}
              />
            </SidebarMenu>
            
            {/* Theme options */}
            <SidebarMenu title="Appearance">
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                  <span>Dark Mode</span>
                </div>
                <DarkModeSwitch />
              </div>
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
