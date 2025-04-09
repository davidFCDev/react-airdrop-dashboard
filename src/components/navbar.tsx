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

import { Logo, TelegramIcon, TwitterIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { image_avatar } from "@/constants";
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
      return [
        "Home",
        "Dashboard",
        "Airdrops",
        "Info",
        "Help & Feedback",
      ].includes(item.label);
    } else if (role === "admin") {
      return [
        "Home",
        "Dashboard",
        "Airdrops",
        "Create",
        "Info",
        "Help & Feedback",
      ].includes(item.label);
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
    <HeroUINavbar
      className="border-b border-default-200"
      maxWidth="full"
      position="sticky"
    >
      <NavbarContent
        className="basis-1/5 sm:basis-full flex gap-0"
        justify="start"
      >
        <NavbarBrand className="max-w-fit border-r border-default-200 h-full pr-6">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo className="text-secondary-600" />
            <p className="font-bold text-inherit">
              AIRDROP <span className="text-secondary-600">HUB</span>
            </p>
          </Link>
        </NavbarBrand>
        <div className="hidden lg:flex justify-start h-full">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              className={clsx(
                linkStyles({ color: "foreground" }),
                "h-full flex items-center",
              )}
              color="foreground"
              href={item.href}
            >
              <NavbarItem
                className={clsx(
                  "border-r border-default-200 h-full px-4 flex items-center",
                  "hover:border-b-2 hover:border-b-primary cursor-pointer",
                  window.location.pathname === item.href &&
                    "border-b-2 border-b-primary",
                )}
              >
                {t(`navbar.${item.label}`)}
              </NavbarItem>
            </Link>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-6">
          <Link isExternal href={siteConfig.links.twitter} title="Twitter">
            <TwitterIcon className="text-default-700" />
          </Link>
          <Link isExternal href={siteConfig.links.discord} title="Discord">
            <TelegramIcon className="text-default-700" />
          </Link>
          <ThemeSwitch className="text-default-700" />
        </NavbarItem>

        {user && (
          <NavbarItem className="hidden md:flex pl-6 border-l border-default-200 h-full justify-center items-center">
            <Dropdown>
              <DropdownTrigger>
                <Avatar
                  isBordered
                  className="cursor-pointer"
                  color="primary"
                  radius="md"
                  size="sm"
                  src={image_avatar}
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

      <NavbarContent className="sm:hidden basis-1 sm:pl-4" justify="end">
        <Link isExternal href={siteConfig.links.twitter} title="Twitter">
          <TwitterIcon className="text-default-700" />
        </Link>
        <Link isExternal href={siteConfig.links.discord} title="Discord">
          <TelegramIcon className="text-default-700" />
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
