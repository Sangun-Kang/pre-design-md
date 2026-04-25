import { create } from 'zustand';
import type {
  ColorInput,
  DecisionStep,
  DesignDecisions,
  RadiusInput,
  ShadowInput,
  SpacingInput,
  Step,
  TypographyInput,
} from '../types/design';

interface DesignStoreState extends DesignDecisions {
  currentStep: Step;
  completedSteps: Set<DecisionStep>;
}

interface DesignStoreActions {
  setStep: (step: Step) => void;
  updateTypography: (v: TypographyInput) => void;
  updateSpacing: (v: SpacingInput) => void;
  updateRadius: (v: RadiusInput) => void;
  updateShadow: (v: ShadowInput) => void;
  updateColor: (v: ColorInput) => void;
  markComplete: (step: DecisionStep) => void;
  reset: () => void;
}

export type DesignStore = DesignStoreState & DesignStoreActions;

const INITIAL: DesignStoreState = {
  currentStep: 'start',
  completedSteps: new Set<DecisionStep>(),
  typography: null,
  spacing: null,
  radius: null,
  shadow: null,
  color: null,
};

export const useDesignStore = create<DesignStore>((set) => ({
  ...INITIAL,

  setStep: (step) => set({ currentStep: step }),

  updateTypography: (v) =>
    set((state) => ({
      typography: v,
      completedSteps: new Set([...state.completedSteps, 'typography' as DecisionStep]),
    })),

  updateSpacing: (v) =>
    set((state) => ({
      spacing: v,
      completedSteps: new Set([...state.completedSteps, 'spacing' as DecisionStep]),
    })),

  updateRadius: (v) =>
    set((state) => ({
      radius: v,
      completedSteps: new Set([...state.completedSteps, 'radius' as DecisionStep]),
    })),

  updateShadow: (v) =>
    set((state) => ({
      shadow: v,
      completedSteps: new Set([...state.completedSteps, 'shadow' as DecisionStep]),
    })),

  updateColor: (v) =>
    set((state) => ({
      color: v,
      completedSteps: new Set([...state.completedSteps, 'color' as DecisionStep]),
    })),

  markComplete: (step) =>
    set((state) => ({
      completedSteps: new Set([...state.completedSteps, step]),
    })),

  reset: () =>
    set({
      ...INITIAL,
      completedSteps: new Set<DecisionStep>(),
    }),
}));

export function selectDecisions(state: DesignStore): DesignDecisions {
  return {
    typography: state.typography,
    spacing: state.spacing,
    radius: state.radius,
    shadow: state.shadow,
    color: state.color,
  };
}
