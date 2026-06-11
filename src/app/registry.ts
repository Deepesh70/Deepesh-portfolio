import { lazy } from "react";
import type { AppDefinition } from "@/lib/types";

// ─── App Registry ────────────────────────────────────────
// The single source of truth for ALL apps in the OS.
// Desktop, Start Menu, Taskbar, and WindowManager all read from here.

export const appRegistry: AppDefinition[] = [
  {
    id: "about",
    title: "About Me",
    icon: "/icons/about.svg",
    component: lazy(() => import("./about/AboutApp")),
    defaultSize: { width: 750, height: 550 },
    defaultPosition: { x: 120, y: 60 },
    minSize: { width: 400, height: 300 },
    canResize: true,
    canMaximize: true,
    singleInstance: true,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "projects",
    title: "Projects",
    icon: "/icons/folder.svg",
    component: lazy(() => import("./projects/ProjectsApp")),
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 150, y: 80 },
    minSize: { width: 500, height: 400 },
    canResize: true,
    canMaximize: true,
    singleInstance: true,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "resume",
    title: "Resume",
    icon: "/icons/resume.svg",
    component: lazy(() => import("./resume/ResumeApp")),
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 180, y: 100 },
    minSize: { width: 400, height: 300 },
    canResize: true,
    canMaximize: true,
    singleInstance: true,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "contact",
    title: "Contact",
    icon: "/icons/contact.svg",
    component: lazy(() => import("./contact/ContactApp")),
    defaultSize: { width: 500, height: 450 },
    defaultPosition: { x: 200, y: 120 },
    minSize: { width: 350, height: 300 },
    canResize: true,
    canMaximize: true,
    singleInstance: true,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "blog",
    title: "Blog",
    icon: "/icons/blog.svg",
    component: lazy(() => import("./blog/BlogApp")),
    defaultSize: { width: 800, height: 600 },
    defaultPosition: { x: 140, y: 70 },
    minSize: { width: 500, height: 400 },
    canResize: true,
    canMaximize: true,
    singleInstance: false,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: "/icons/terminal.svg",
    component: lazy(() => import("./terminal/TerminalApp")),
    defaultSize: { width: 650, height: 420 },
    defaultPosition: { x: 160, y: 90 },
    minSize: { width: 400, height: 250 },
    canResize: true,
    canMaximize: true,
    singleInstance: false,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "music",
    title: "Music Player",
    icon: "/icons/music.svg",
    component: lazy(() => import("./music/MusicApp")),
    defaultSize: { width: 350, height: 500 },
    defaultPosition: { x: 250, y: 100 },
    minSize: { width: 300, height: 400 },
    canResize: false,
    canMaximize: false,
    singleInstance: true,
    showInDesktop: true,
    showInStartMenu: true,
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: "/icons/gallery.svg",
    component: lazy(() => import("./gallery/GalleryApp")),
    defaultSize: { width: 850, height: 600 },
    defaultPosition: { x: 130, y: 55 },
    minSize: { width: 500, height: 400 },
    canResize: true,
    canMaximize: true,
    singleInstance: true,
    showInDesktop: true,
    showInStartMenu: true,
  },
];

// ─── Helper Utilities ────────────────────────────────────

export const getAppById = (id: string) =>
  appRegistry.find((app) => app.id === id);

export const getDesktopApps = () =>
  appRegistry.filter((app) => app.showInDesktop);

export const getStartMenuApps = () =>
  appRegistry.filter((app) => app.showInStartMenu);
