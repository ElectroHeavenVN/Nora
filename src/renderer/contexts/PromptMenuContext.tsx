import { createContext, ReactElement } from 'react';

export interface PromptMenuStateContextType {
  PromptMenuData: {
    content: any;
    isVisible: boolean;
    className: string;
  };
}
export interface PromptMenuUpdateContextType {
  changePromptMenuData: (
    isVisible: boolean,
    content?: ReactElement<any, any>,
    className?: string
  ) => void;
}

export const PromptMenuStateContext = createContext(
  {} as PromptMenuStateContextType
);
export const PromptMenuUpdateContext = createContext(
  {} as PromptMenuUpdateContextType
);
