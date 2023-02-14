/* eslint-disable no-underscore-dangle */
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistStoreProps } from '../types';
import type { SettingsProps, SettingsState } from './types';
import { SettingsToolTypes } from './types';

export const defaultConfigurableSettings: Pick<
  SettingsState,
  'routePriority' | 'slippage'
> = {
  routePriority: 'RECOMMENDED',
  slippage: '0.5',
};

export const defaultSettings: SettingsProps = {
  appearance: 'auto',
  gasPrice: 'normal',
  showDestinationWallet: true,
  enabledBridges: [],
  enabledExchanges: [],
};

export const createSettingsStore = ({ namePrefix }: PersistStoreProps) =>
  create<SettingsState>(
    persist(
      (set, get) => ({
        ...defaultSettings,
        setValue: (key, value) =>
          set(() => ({
            [key]: value,
          })),
        setValues: (values) =>
          set((state) => {
            const updatedState: SettingsProps = { ...state };
            for (const key in values) {
              if (Object.hasOwn(state, key)) {
                updatedState[key] = values[key];
              }
            }
            return updatedState;
          }),
        initializeTools: (toolType, tools, reset) => {
          if (!tools.length) {
            return;
          }
          set((state) => {
            const updatedState = { ...state };
            if (updatedState[`_enabled${toolType}`] && !reset) {
              // Add new tools
              const enabledTools = tools
                .filter(
                  (tool) =>
                    !Object.hasOwn(
                      updatedState[`_enabled${toolType}`] as object,
                      tool,
                    ),
                )
                .reduce((values, tool) => {
                  values[tool] = true;
                  return values;
                }, updatedState[`_enabled${toolType}`] as Record<string, boolean>);
              // Filter tools we no longer have
              updatedState[`_enabled${toolType}`] = Object.fromEntries(
                Object.entries(enabledTools).filter(([key]) =>
                  tools.includes(key),
                ),
              );
            } else {
              updatedState[`_enabled${toolType}`] = tools.reduce(
                (values, tool) => {
                  values[tool] = true;
                  return values;
                },
                {} as Record<string, boolean>,
              );
            }
            updatedState[`enabled${toolType}`] = Object.entries(
              updatedState[`_enabled${toolType}`]!,
            )
              .filter(([_, value]) => value)
              .map(([key]) => key);
            return updatedState;
          });
        },
        setTools: (toolType, tools, availableTools) =>
          set(() => ({
            [`enabled${toolType}`]: tools,
            [`_enabled${toolType}`]: availableTools.reduce(
              (values, toolKey) => {
                values[toolKey] = tools.includes(toolKey);
                return values;
              },
              {} as Record<string, boolean>,
            ),
          })),
        reset: (bridges, exchanges) => {
          set(() => ({
            ...defaultSettings,
            ...defaultConfigurableSettings,
          }));
          get().initializeTools('Bridges', bridges, true);
          get().initializeTools('Exchanges', exchanges, true);
        },
      }),
      {
        name: `${namePrefix || 'li.fi'}-widget-settings`,
        version: 2,
        partialize: (state) => {
          const { enabledBridges, enabledExchanges, ...partializedState } =
            state;
          return partializedState;
        },
        merge: (persistedState: any, currentState: SettingsState) => {
          const state = { ...currentState, ...persistedState };
          SettingsToolTypes.forEach((toolType) => {
            state[`enabled${toolType}`] = Object.entries(
              persistedState[`_enabled${toolType}`],
            )
              .filter(([_, value]) => value)
              .map(([key]) => key);
          });
          return state;
        },
        migrate: (persistedState: any, version) => {
          if (version === 0 && persistedState.appearance === 'system') {
            persistedState.appearance = defaultSettings.appearance;
          }
          if (version === 1) {
            persistedState.slippage = defaultConfigurableSettings.slippage;
          }
          return persistedState as SettingsState;
        },
      },
    ) as StateCreator<SettingsState, [], [], SettingsState>,
  );