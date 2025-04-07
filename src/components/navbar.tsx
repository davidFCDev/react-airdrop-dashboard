import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { DiscordIcon, GithubIcon, Logo, TwitterIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { useUserAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, role, signOut } = useUserAuth();
  const navigate = useNavigate();

  // Filtrado de ítems de navegación
  const desktopNavItems = siteConfig.navItems.filter((item) => {
    if (!user) {
      return ["Home", "Login", "Register", "Help & Feedback"].includes(
        item.label,
      );
    } else if (role === "user") {
      return ["Home", "Airdrops", "Info", "Help & Feedback"].includes(
        item.label,
      );
    } else if (role === "admin") {
      return ["Home", "Airdrops", "Info", "Help & Feedback", "Create"].includes(
        item.label,
      );
    }

    return false;
  });

  const items = [
    { key: "profile", label: t("navbar.Profile") },
    { key: "logout", label: t("navbar.Logout") },
  ];

  const mobileNavItems = siteConfig.navMenuItems.filter((item) => {
    if (!user) {
      return ["Dashboard", "Login", "Register", "Help & Feedback"].includes(
        item.label,
      );
    } else if (role === "user") {
      return [
        "Profile",
        "Dashboard",
        "Airdrops",
        "Info",
        "Help & Feedback",
        "Logout",
      ].includes(item.label);
    } else if (role === "admin") {
      return [
        "Profile",
        "Dashboard",
        "Airdrops",
        "Info",
        "Help & Feedback",
        "Create",
        "Logout",
      ].includes(item.label);
    }

    return false;
  });

  const handleDropdownAction = (key: string) => {
    if (key === "profile") {
      navigate("/profile");
    } else if (key === "logout") {
      signOut();
      navigate("/");
    }
  };

  return (
    <HeroUINavbar maxWidth="2xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">HUNTERS</p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {desktopNavItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {t(`navbar.${item.label}`)}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        {user && (
          <NavbarItem className="hidden md:flex">
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  className="cursor-pointer"
                  color="primary"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Actions"
                items={items}
                onAction={(key) => handleDropdownAction(key as string)}
              >
                {(item) => (
                  <DropdownItem
                    key={item.key}
                    className={item.key === "logout" ? "text-danger" : ""}
                    color={item.key === "logout" ? "danger" : "default"}
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {mobileNavItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === mobileNavItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
                size="lg"
              >
                {t(`navbar.${item.label}`)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
