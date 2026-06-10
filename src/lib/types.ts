import { ComponentType, LazyExoticComponent } from "react";

//Geometry
export interface Position {
    x: number;
    y: number;
}

export interface Size{
    width: number;
    height: number;
}


//Window System

export type WindowStatus = "open" | "minimized" | "maximized";

export interface WindowState{
    id: string;
    appId: string;
    position:Position;
    size:Size;
    prevPosition: Position;
    prevSize: Size;
    zIndex: number;
    status: WindowStatus;
    isAnimating: boolean;
    openedAt: number;
}

// App Registry

export interface AppDefinition {
    id: string;
    title: string;
    icon: string;
    component: LazyExoticComponent<ComponentType>;
    defaultSize: Size;
    defaultPosition: Position;
    minSize?: Size;
    canResize: boolean;
    canMaximize: boolean;
    singleInstance: boolean;
    showInDesktop:boolean;
    showInStartMenu: boolean;
    category?: string;
}

// Theme
export type ThemeMode = "dark" | "light" | "system";