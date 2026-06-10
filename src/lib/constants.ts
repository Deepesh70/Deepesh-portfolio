// z-Index Layers

export const Z_INDEX ={
    DESKTOP: 0,
    DESKTOP_ICONS: 10,
    WINDOWS:100,
    CONTEXT_MENU:8000,
    TASKBAR: 9000,
    START_MENU:  9500,
    LOCK_SCREEN: 10000,
    BOOT_SCREEN: 10500,
} as const;

// Layout Sizes

export const TASKBAR_HEIGHT = 48; 

export const WINDOW_MIN_SIZE ={
    width: 300,
    height: 200,
} as const;

// Desktop Icons
export const ICON_GRID ={
    CELL_WIDTH: 90,
    CELL_HEIGHT: 100,
    PADDING: 16,
} as const;