import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
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
import { ScrollShadow } from "@heroui/scroll-shadow";
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
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import LanguageSelector from "../LanguageSelector";
import { ThemeSwitch } from "../theme-switch";

import { Logo, TelegramIcon, TwitterIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { avatar1 } from "@/constants";
import { useUserAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { Post } from "@/types";

interface UserData {
  avatar?: string;
}

const labelToTranslationKey: Record<string, string> = {
  Login: "login",
  Register: "register",
  Airdrops: "airdrops",
  Watchlist: "watchlist",
  "Help & Feedback": "help_and_feedback",
  Create: "create",
  Posts: "posts",
  Profile: "profile",
  Dashboard: "dashboard",
  Logout: "logout",
  Tracker: "tracker",
  Notifications: "notifications",
};

// Hook personalizado para detectar clics fuera
const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, role, signOut } = useUserAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Post[]>([]);
  const [viewedPosts, setViewedPosts] = useState<Set<string>>(new Set());
  const [isActionsCardOpen, setIsActionsCardOpen] = useState(false);
  const [isNotificationsCardOpen, setIsNotificationsCardOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(avatar1);

  const actionsRef = useOutsideClick(() => {
    setIsActionsCardOpen(false);
    setIsNotificationsCardOpen(false);
  });

  const notificationsRef = useOutsideClick(() => {
    setIsActionsCardOpen(false);
    setIsNotificationsCardOpen(false);
  });

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
            (doc) => ({ id: doc.id, ...doc.data() }) as Post,
          );

          setNotifications(posts);
          setError(null);
        },
        (err) => {
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
    setIsActionsCardOpen(false);
    setIsNotificationsCardOpen(false);
    navigate(`/posts/${postId}`);
  };

  const handleNotificationsOpen = () => {
    setIsActionsCardOpen(false);
    setIsNotificationsCardOpen(true);
  };

  const handleAvatarClick = () => {
    if (isNotificationsCardOpen) {
      setIsNotificationsCardOpen(false);
      setIsActionsCardOpen(true);
    } else {
      setIsActionsCardOpen(!isActionsCardOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, postId?: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (postId) {
        handleNotificationClick(postId);
      } else {
        handleNotificationsOpen();
      }
    }
  };

  const handleActionClick = (key: string) => {
    if (key === "logout") {
      signOut();
      navigate("/");
      setIsActionsCardOpen(false);
      setIsNotificationsCardOpen(false);
    } else if (key === "notifications") {
      handleNotificationsOpen();
    }
  };

  const desktopNavItems = siteConfig.navItems.filter((item) => {
    if (!user) {
      return ["Login", "Register", "Help & Feedback"].includes(item.label);
    } else if (role === "user") {
      return [
        "Dashboard",
        "Airdrops",
        "Watchlist",
        "Tracker",
        "Help & Feedback",
      ].includes(item.label);
    } else if (role === "admin") {
      return [
        "Dashboard",
        "Airdrops",
        "Create",
        "Posts",
        "Watchlist",
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
        "Watchlist",
        "Tracker",
        "Notifications",
        "Help & Feedback",
        "Logout",
      ].includes(item.label);
    } else if (role === "admin") {
      return [
        "Dashboard",
        "Airdrops",
        "Watchlist",
        "Posts",
        "Tracker",
        "Notifications",
        "Help & Feedback",
        "Create",
        "Logout",
      ].includes(item.label);
    }

    return false;
  });

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
        <NavbarBrand className="max-w-fit border-r border-default-200 h-full pr-10">
          <Link
            className="flex justify-start items-center gap-2"
            color="foreground"
            href="/"
          >
            <Logo className="text-primary" />

            <p className="font-semibold leading-none text-2xl">Airdrop.hub</p>
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
          <Link isExternal href={siteConfig.links.telegram} title="Telegram">
            <TelegramIcon className="text-default-700" />
          </Link>
          <ThemeSwitch />
          <LanguageSelector />
        </NavbarItem>

        {user && (
          <NavbarItem className="hidden md:flex pl-6 border-l border-default-200 h-full justify-center items-center">
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
                onClick={handleAvatarClick}
              />
              {unreadNotifications > 0 && (
                <span className="absolute -bottom-2 -right-2 bg-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </div>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 sm:pl-4" justify="end">
        <Link isExternal href={siteConfig.links.twitter} title="Twitter">
          <TwitterIcon className="text-default-700" />
        </Link>
        <Link isExternal href={siteConfig.links.telegram} title="Telegram">
          <TelegramIcon className="text-default-700" />
        </Link>
        <LanguageSelector />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {mobileNavItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              {item.label === "Notifications" ? (
                <Button
                  className="w-full text-left"
                  color={
                    index === mobileNavItems.length - 1 ? "danger" : "default"
                  }
                  variant="light"
                  onPress={handleNotificationsOpen}
                >
                  {t(`navbar.${labelToTranslationKey[item.label]}`)} (
                  {unreadNotifications})
                </Button>
              ) : (
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
              )}
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>

      {/* Primera Card para acciones */}
      {isActionsCardOpen && (
        <Card
          ref={actionsRef}
          className="absolute sm:top-16 sm:right-1 top-1/2  sm:-translate-x-0 sm:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-80 bg-default-50 border border-default-200 shadow-md z-50"
          radius="none"
        >
          <CardBody className="p-0">
            <Button
              aria-label={t("navbar.notifications")}
              className="w-full justify-start px-4 py-2 text-left"
              variant="light"
              onKeyDown={(e) => handleKeyDown(e)}
              onPress={() => handleActionClick("notifications")}
            >
              {t("navbar.notifications")} ({unreadNotifications})
            </Button>
            <Button
              aria-label={t("navbar.logout")}
              className="w-full justify-start px-4 py-2 text-left text-danger"
              variant="light"
              onKeyDown={(e) => handleKeyDown(e)}
              onPress={() => handleActionClick("logout")}
            >
              {t("navbar.logout")}
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Segunda Card para notificaciones */}
      {isNotificationsCardOpen && (
        <Card
          ref={notificationsRef}
          className="absolute sm:top-16 sm:right-1 top-1/2 sm:-translate-x-0 sm:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-80 bg-default-50 border border-default-200 shadow-md z-50"
          radius="none"
        >
          <CardHeader className="px-4 py-2 border-b border-default-200">
            {t("navbar.notifications")}
          </CardHeader>
          <CardBody className="p-0">
            <ScrollShadow className="max-h-64 w-full">
              {error ? (
                <p className="p-4 text-danger">
                  {t("navbar.error_notifications")}
                </p>
              ) : sortedNotifications.length === 0 ? (
                <p className="p-4">{t("navbar.no_notifications")}</p>
              ) : (
                sortedNotifications.map((post) => (
                  <Button
                    key={post.id}
                    aria-label={
                      i18n.language === "es" ? post.title.es : post.title.en
                    }
                    className={`w-full justify-start px-4 py-2 text-left ${
                      viewedPosts.has(post.id)
                        ? "text-default-500"
                        : "text-foreground"
                    }`}
                    variant="light"
                    onKeyDown={(e) => handleKeyDown(e, post.id)}
                    onPress={() => handleNotificationClick(post.id)}
                  >
                    <span className="mr-2">•</span>
                    {i18n.language === "es" ? post.title.es : post.title.en}
                  </Button>
                ))
              )}
            </ScrollShadow>
          </CardBody>
        </Card>
      )}
    </HeroUINavbar>
  );
};
