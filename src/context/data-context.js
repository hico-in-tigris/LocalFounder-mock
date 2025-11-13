import { React } from '../shared/react.js';
import { useLocalStorageState } from '../lib/hooks.js';
import {
  defaultStartupProfile,
  defaultExperiments,
  defaultFundingPrograms,
  defaultPermitTemplates,
  defaultPermitTasks,
  defaultKpiRecords,
  defaultBmcNotes,
  defaultPL
} from '../lib/defaults.js';

const { createContext, useContext, useMemo } = React;

const DataContext = createContext(null);

export function useDataContext() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [startupProfile, setStartupProfile] = useLocalStorageState('startupProfile', defaultStartupProfile);
  const [experiments, setExperiments] = useLocalStorageState('experiments', defaultExperiments);
  const [fundingPrograms, setFundingPrograms] = useLocalStorageState('fundingPrograms', defaultFundingPrograms);
  const [permitTemplates] = useLocalStorageState('permitTemplates', defaultPermitTemplates);
  const [permitTasks, setPermitTasks] = useLocalStorageState('permitTasks', defaultPermitTasks);
  const [kpiRecords, setKpiRecords] = useLocalStorageState('kpiRecords', defaultKpiRecords);
  const [bmcNotes, setBmcNotes] = useLocalStorageState('bmcNotes', defaultBmcNotes);
  const [plData, setPlData] = useLocalStorageState('plData', defaultPL);
  const [pricingTier, setPricingTier] = useLocalStorageState('pricingTier', 'Free');

  const value = useMemo(
    () => ({
      startupProfile,
      setStartupProfile,
      experiments,
      setExperiments,
      fundingPrograms,
      setFundingPrograms,
      permitTemplates,
      permitTasks,
      setPermitTasks,
      kpiRecords,
      setKpiRecords,
      bmcNotes,
      setBmcNotes,
      plData,
      setPlData,
      pricingTier,
      setPricingTier
    }),
    [
      startupProfile,
      experiments,
      fundingPrograms,
      permitTemplates,
      permitTasks,
      kpiRecords,
      bmcNotes,
      plData,
      pricingTier
    ]
  );

  return React.createElement(DataContext.Provider, { value }, children);
}
