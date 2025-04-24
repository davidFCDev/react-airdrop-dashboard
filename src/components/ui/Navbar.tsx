import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
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
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LanguageSelector from "../LanguageSelector";
import { ThemeSwitch } from "../theme-switch";

import { Logo, TelegramIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { avatar1 } from "@/constants"; // Default avatar
import { useUserAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { Post } from "@/service/post.service";

interface UserData {
  avatar?: string;
}

const labelToTranslationKey: Record<string, string> = {
  Login: "login",
  Register: "register",
  Airdrops: "airdrops",
  Favorites: "favorites",
  "Help & Feedback": "help_and_feedback",
  Create: "create",
  Posts: "posts",
  Profile: "profile",
  Dashboard: "dashboard",
  Logout: "logout",
  Tracker: "tracker",
};

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, role, signOut } = useUserAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Post[]>([]);
  const [viewedPosts, setViewedPosts] = useState<Set<string>>(new Set());
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(avatar1);

  const unreadNotifications = notifications.filter(
    (post) => !viewedPosts.has(post.id),
  ).length;

  const sortedNotifications = notifications
    .sort((a, b) => {
      const aIsUnread = !viewedPosts.has(a.id);
      const bIsUnread = !viewedPosts.has(b.id);

      if (aIsUnread && !bIsUnread) return -1;
      if (!aIsUnread && bIsUnread) return 1;

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    })
    .slice(0, 10);

  const items = [
    {
      key: "notifications",
      label: `${t("navbar.notifications")} (${unreadNotifications})`,
    },
    { key: "logout", label: t("navbar.logout") },
  ];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setNotifications([]);
        setError(null);
        setUserAvatar(avatar1);

        return;
      }

      // Fetch user avatar
      const userRef = doc(db, "users", currentUser.uid);
      const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;

          setUserAvatar(data.avatar || avatar1);
        }
      });

      // Fetch notifications
      const q = query(collection(db, "posts"), orderBy("created_at", "desc"));
      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const posts = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as Post,
          );

          setNotifications(posts);
          setError(null);
        },
        (err) => {
          console.error("Firestore error in Navbar:", err);
          setError(`Error fetching notifications: ${err.message}`);
          setNotifications([]);
        },
      );

      const storedViewed = localStorage.getItem(
        `viewedPosts_${currentUser.uid}`,
      );

      if (storedViewed) {
        setViewedPosts(new Set(JSON.parse(storedViewed)));
      }

      return () => {
        unsubscribeSnapshot();
        unsubscribeUser();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const handleNotificationClick = (postId: string) => {
    const newViewed = new Set(viewedPosts).add(postId);

    setViewedPosts(newViewed);
    localStorage.setItem(
      `viewedPosts_${user?.uid}`,
      JSON.stringify([...newViewed]),
    );
    setIsMainDropdownOpen(false);
    setIsNotificationsOpen(false);
    navigate(`/posts/${postId}`);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent, postId?: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (postId) {
        handleNotificationClick(postId);
      } else {
        handleNotificationsToggle();
      }
    }
  };

  const handleCloseOutside = (element: Element) => {
    setIsMainDropdownOpen(false);
    setIsNotificationsOpen(false);

    return true;
  };

  const desktopNavItems = siteConfig.navItems.filter((item) => {
    if (!user) {
      return ["Login", "Register", "Help & Feedback"].includes(item.label);
    } else if (role === "user") {
      return [
        "Dashboard",
        "Airdrops",
        "Favorites",
        "Tracker",
        "Help & Feedback",
      ].includes(item.label);
    } else if (role === "admin") {
      return [
        "Dashboard",
        "Airdrops",
        "Create",
        "Posts",
        "Favorites",
        "Tracker",
        "Help & Feedback",
      ].includes(item.label);
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
        "Dashboard",
        "Airdrops",
        "Favorites",
        "Tracker",
        "Help & Feedback",
        "Logout",
      ].includes(item.label);
    } else if (role === "admin") {
      return [
        "Dashboard",
        "Airdrops",
        "Favorites",
        "Posts",
        "Tracker",
        "Help & Feedback",
        "Create",
        "Logout",
      ].includes(item.label);
    }

    return false;
  });

  const handleDropdownAction = (key: string) => {
    if (key === "logout") {
      signOut();
      navigate("/");
      setIsMainDropdownOpen(false);
      setIsNotificationsOpen(false);
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
                {t(`navbar.${labelToTranslationKey[item.label]}`)}
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
          <ThemeSwitch />
          <LanguageSelector />
        </NavbarItem>

        {user && (
          <NavbarItem className="hidden md:flex pl-6 border-l border-default-200 h-full justify-center items-center">
            <Dropdown
              isOpen={isMainDropdownOpen}
              shouldCloseOnInteractOutside={(element: Element) =>
                !isNotificationsOpen
              }
              onOpenChange={setIsMainDropdownOpen}
            >
              <DropdownTrigger>
                <div className="relative">
                  <Avatar
                    isBordered
                    aria-label={t("navbar.user_avatar")}
                    className="cursor-pointer"
                    color="primary"
                    name={user?.email?.charAt(0).toUpperCase() || "?"}
                    radius="md"
                    size="sm"
                    src={userAvatar}
                  />
                  {unreadNotifications > 0 && (
                    <span className="absolute bottom-0 right-0 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label={t("navbar.user_actions")}
                className="z-50"
                items={items}
                onAction={(key) => handleDropdownAction(key as string)}
              >
                {(item) => (
                  <DropdownItem
                    key={item.key}
                    className={item.key === "logout" ? "text-danger" : ""}
                    color={item.key === "logout" ? "danger" : "default"}
                    role="menuitem"
                    textValue={item.label}
                    onKeyDown={(e) => handleKeyDown(e)}
                  >
                    {item.key === "notifications" ? (
                      <div className="relative">
                        <Button
                          aria-controls="notifications-submenu"
                          aria-expanded={isNotificationsOpen}
                          aria-label={item.label}
                          className="w-full text-left justify-start"
                          variant="light"
                          onPress={handleNotificationsToggle}
                        >
                          {item.label}
                        </Button>
                        {isNotificationsOpen && (
                          <Dropdown
                            isOpen={isNotificationsOpen}
                            placement="left"
                            shouldCloseOnInteractOutside={handleCloseOutside}
                            onOpenChange={(open) =>
                              setIsNotificationsOpen(open)
                            }
                          >
                            <DropdownTrigger>
                              <span className="hidden" />
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label={t("navbar.notifications")}
                              className="z-50 max-h-64 overflow-y-auto w-64"
                              role="menu"
                            >
                              {error ? (
                                <DropdownItem
                                  key="error"
                                  role="menuitem"
                                  textValue="Error loading notifications"
                                >
                                  <span className="text-danger">
                                    {t("navbar.error_notifications")}
                                  </span>
                                </DropdownItem>
                              ) : sortedNotifications.length === 0 ? (
                                <DropdownItem
                                  key="no_notifications"
                                  role="menuitem"
                                  textValue={t("navbar.no_notifications")}
                                >
                                  {t("navbar.no_notifications")}
                                </DropdownItem>
                              ) : (
                                sortedNotifications.map((post) => (
                                  <DropdownItem
                                    key={post.id}
                                    className={
                                      !viewedPosts.has(post.id)
                                        ? "font-bold"
                                        : ""
                                    }
                                    role="menuitem"
                                    textValue={
                                      i18n.language === "es"
                                        ? post.title.es
                                        : post.title.en
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, post.id)}
                                    onPress={() =>
                                      handleNotificationClick(post.id)
                                    }
                                  >
                                    {i18n.language === "es"
                                      ? post.title.es
                                      : post.title.en}
                                  </DropdownItem>
                                ))
                              )}
                            </DropdownMenu>
                          </Dropdown>
                        )}
                      </div>
                    ) : (
                      item.label
                    )}
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
        <LanguageSelector />
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
                {t(`navbar.${labelToTranslationKey[item.label]}`)}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
