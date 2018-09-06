import { createContext } from "react";

export const createNamedContext = <T>(name: string, defaultValue?: T) => {
  const Context = createContext(defaultValue);
  Context.Consumer.displayName = `${name}.Consumer`;
  Context.Provider.displayName = `${name}.Provider`;
  return Context;
};
