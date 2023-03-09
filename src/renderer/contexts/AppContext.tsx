/* eslint-disable import/prefer-default-export */
import { createContext } from 'react';

export interface ThemeAppStateContextType {
  // THEME
  isDarkMode: boolean;
}

export interface ContextMenuAppStateContextType {
  // CONTEXT MENU
  contextMenuData: ContextMenuData;
}

export interface PromptMenuAppStateContextType {
  // PROMPT MENU
  promptMenuData: {
    content: any;
    isVisible: boolean;
    className: string;
  };
}

export interface NotificationPanelAppStateContextType {
  // NOTIFICATION PANEL
  notificationPanelData: NotificationPanelData;
}

export interface NavigationAppStateContextType {
  // CURRENTLY ACTVIE PAGE AND NAVIGATION HISTORY
  currentlyActivePage: { pageTitle: PageTitles; data?: any };
  pageHistoryIndex: number;
  noOfPagesInHistory: number;
}

export interface PlaybackAppStateContextType {
  // AUDIO PLAYBACK
  currentSongData: AudioPlayerData;
  isCurrentSongPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isRepeating: RepeatTypes;
  isShuffling: boolean;
}

export interface QueueAppStateContextType {
  // QUEUE
  queue: Queue;
}

export interface MultipleSelectionsAppStateContextType {
  // MULTIPLE SELECTIONS DATA
  multipleSelectionsData: MultipleSelectionData;
  isMultipleSelectionEnabled: boolean;
}

export interface MiniPlayerAppStateContextType {
  // MINI PLAYER
  isMiniPlayer: boolean;
}

export interface AppUpdatesAppStateContextType {
  // APP UPDATES DATA
  appUpdatesState: AppUpdatesState;
}

export interface UserDataAppStateContextType {
  // USER DATA
  userData: UserData | undefined;
}

export interface OtherAppStateContextType {
  // OTHER
  bodyBackgroundImage?: string;
  isPlayerStalled: boolean;
}

export interface AppStateContextType {
  // THEME
  isDarkMode: boolean;
  // CONTEXT MENU
  contextMenuData: ContextMenuData;
  // PROMPT MENU
  PromptMenuData: {
    content: any;
    isVisible: boolean;
    className: string;
  };
  // NOTIFICATION PANEL
  notificationPanelData: NotificationPanelData;
  // CURRENTLY ACTVIE PAGE AND NAVIGATION HISTORY
  currentlyActivePage: { pageTitle: PageTitles; data?: any };
  pageHistoryIndex: number;
  noOfPagesInHistory: number;
  // AUDIO PLAYBACK
  currentSongData: AudioPlayerData;
  userData: UserData | undefined;
  isCurrentSongPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isRepeating: RepeatTypes;
  isShuffling: boolean;
  // QUEUE
  queue: Queue;
  // MULTIPLE SELECTIONS DATA
  multipleSelectionsData: MultipleSelectionData;
  isMultipleSelectionEnabled: boolean;
  // MINI PLAYER
  isMiniPlayer: boolean;
  // APP UPDATES DATA
  appUpdatesState: AppUpdatesState;
  // OTHER
  bodyBackgroundImage?: string;
  isPlayerStalled: boolean;
}

export const AppContext = createContext({} as AppStateContextType);

export const ThemeContext = createContext({} as ThemeAppStateContextType);
export const ContextMenuContext = createContext(
  {} as ContextMenuAppStateContextType
);
export const PromptMenuContext = createContext(
  {} as PromptMenuAppStateContextType
);
export const NotificationPanelContext = createContext(
  {} as NotificationPanelAppStateContextType
);
export const NavigationContext = createContext(
  {} as NavigationAppStateContextType
);
export const PlaybackContext = createContext({} as PlaybackAppStateContextType);
export const QueueContext = createContext({} as QueueAppStateContextType);
export const MultipleSelectionsContext = createContext(
  {} as MultipleSelectionsAppStateContextType
);
export const MiniPlayerContext = createContext(
  {} as MiniPlayerAppStateContextType
);
export const AppUpdatesContext = createContext(
  {} as AppUpdatesAppStateContextType
);
export const OtherContext = createContext({} as OtherAppStateContextType);
