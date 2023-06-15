import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { version } from "../../package.json";
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsCompletedAction,
} from "../reducers/cycles/actions";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { differenceInSeconds } from "date-fns";

// It is best to replicate the interface again in current Context then have the
// dependencies related to zod or any other library, it will create flexibility
// if we need to change the libraries, since it wont affect the context
interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  secondsPassed: number;
  markCurrentCycleAsCompleted: () => void;
  setAmountSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

const localStorageCycles = `@JTimer:cycles-state ${version}`;

export const CyclesContext = createContext({} as CyclesContextType);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    // Initialize empty state or w/ localStorage
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedCyclesAsJson = localStorage.getItem(localStorageCycles);
      if (storedCyclesAsJson) {
        return JSON.parse(storedCyclesAsJson);
      }

      return initialState;
    }
    // Initialize empty state or w/ localStorage
  );

  const { activeCycleId, cycles } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem(localStorageCycles, stateJSON);
  }, [cyclesState]);

  const [secondsPassed, setSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate));
    }

    return 0;
  });

  function markCurrentCycleAsCompleted() {
    dispatch(markCurrentCycleAsCompletedAction());
  }

  function setAmountSecondsPassed(seconds: number) {
    setSecondsPassed(seconds);
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));
    setSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsCompleted,
        secondsPassed,
        setAmountSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
