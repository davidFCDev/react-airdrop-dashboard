import { Button } from "@heroui/button";
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
import { Select, SelectItem } from "@heroui/select";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { DiscordIcon, GithubIcon, Logo, TwitterIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { useUser } from "@/context/AuthContext";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, role, signOut } = useUser();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    i18n.changeLanguage(event.target.value);
  };

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

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">ACME</p>
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
                {t(`navbar.${item.label}`)} {/* Usar el label original */}
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

        <NavbarItem className="hidden sm:flex items-center gap-4">
          <Select
            className="w-32"
            placeholder={t("navbar.language")}
            value={i18n.language}
            variant="faded"
            onChange={handleLanguageChange}
          >
            <SelectItem key="en">English</SelectItem>
            <SelectItem key="es">Español</SelectItem>
          </Select>
        </NavbarItem>

        {user && (
          <NavbarItem className="hidden md:flex">
            <Button
              className="text-sm font-normal text-default-600 bg-default-100"
              variant="flat"
              onClick={signOut}
            >
              {t("navbar.Logout")}
            </Button>
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
                {t(`navbar.${item.label}`)} {/* Usar el label original */}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
