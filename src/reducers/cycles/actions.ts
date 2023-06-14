import { Cycle } from "./reducer";

export enum ActionTypes {
  ADD_NEW_CYCLE = "ADD_NEW_CYCLE",
  MARK_CURRENT_CYCLE_AS_COMPLETED = "MARK_CURRENT_CYCLE_AS_COMPLETED",
  INTERRUPT_CURRENT_CYCLE = "INTERRUPT_CURRENT_CYCLE",
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  };
}

export function markCurrentCycleAsCompletedAction() {
  return {
    type: ActionTypes.MARK_CURRENT_CYCLE_AS_COMPLETED,
  };
}

export function interruptCurrentCycleAction() {
  document.title = "Timer";
  return {
    type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
  };
}
