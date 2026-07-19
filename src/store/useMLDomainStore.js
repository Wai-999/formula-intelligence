import { create } from 'zustand';

// One shared store for every domain lab's driver-panel + scenario-preset
// state (Gold/Macro/Micro/Politics, Modules 6-9) — per BUILD_LOG.md Phase 1
// §3: "shared shape reused... so it's one store, not four." Keyed by domain
// id so each lab's sliders are independent of the others.
export const useMLDomainStore = create((set) => ({
  driverState: { gold: {}, macro: {}, micro: {}, politics: {} },

  setDriver(domain, key, value) {
    set((s) => ({ driverState: { ...s.driverState, [domain]: { ...s.driverState[domain], [key]: value } } }));
  },

  applyScenario(domain, state) {
    set((s) => ({ driverState: { ...s.driverState, [domain]: { ...state } } }));
  },

  resetDomain(domain) {
    set((s) => ({ driverState: { ...s.driverState, [domain]: {} } }));
  },
}));
