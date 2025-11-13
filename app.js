import { React, ReactDOM, MaterialUI, MaterialUIIcons } from './src/shared/react.js';
import { useHashRouter, useLocalStorageState, useNotifier } from './src/lib/hooks.js';
import mockAI from './src/lib/mock-ai.js';
import {
  defaultChatMessages,
  defaultChangeLog,
  defaultApprovals,
  defaultTasks
} from './src/lib/defaults.js';
import { DataProvider, useDataContext } from './src/context/data-context.js';
import AIChatCard from './src/components/AIChatCard.js';
import InfoTabs from './src/components/InfoTabs.js';
import DashboardPage from './src/pages/DashboardPage.js';
import ExperimentsPage from './src/pages/ExperimentsPage.js';
import PlanPage from './src/pages/PlanPage.js';
import FundingPage from './src/pages/FundingPage.js';
import PermitsPage from './src/pages/PermitsPage.js';
import KpiPage from './src/pages/KpiPage.js';
import { OnboardingPage, LoanPackPage, PermitConciergePage, CohortPage, SettingsPage } from './src/pages/ExtraPages.js';
import { SignInDialog, PricingDialog, LoanPackModal, PermitConciergeModal } from './src/components/Modals.js';

const {
  useState,
  useMemo
} = React;

const {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField
} = MaterialUI;

const Icons = MaterialUIIcons;

function App() {
  const [route, navigate] = useHashRouter('#/dashboard');
  const { notify, snackbarElement } = useNotifier();
  const { pricingTier, setPricingTier } = useDataContext();
  const actions = useMemo(() => mockAI.nextThreeActions({}), []);
  const [chatMessages, setChatMessages] = useLocalStorageState('ai_chat_threads', defaultChatMessages);
  const [changeLog] = useLocalStorageState('change_log', defaultChangeLog);
  const [approvals] = useLocalStorageState('approvals', defaultApprovals);
  const [tasks, setTasks] = useLocalStorageState('tasks', defaultTasks);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [loanPackOpen, setLoanPackOpen] = useState(false);
  const [permitConciergeOpen, setPermitConciergeOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', icon: Icons.Dashboard, path: '#/dashboard' },
    { label: 'Experiments', icon: Icons.Science, path: '#/experiments' },
    { label: 'Plan', icon: Icons.EventNote, path: '#/plan' },
    { label: 'Funding', icon: Icons.MonetizationOn, path: '#/funding' },
    { label: 'Permits', icon: Icons.Gavel, path: '#/permits' },
    { label: 'KPI', icon: Icons.ShowChart, path: '#/kpi' },
    { label: 'Settings', icon: Icons.Settings, path: '#/settings' }
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const renderContent = () => {
    switch (route.replace('#', '')) {
      case '/dashboard':
        return React.createElement(DashboardPage, { actions });
      case '/experiments':
        return React.createElement(ExperimentsPage, { notify });
      case '/plan':
        return React.createElement(PlanPage, { notify });
      case '/funding':
        return React.createElement(FundingPage, { notify, onRequestLoanPack: () => setLoanPackOpen(true) });
      case '/permits':
        return React.createElement(PermitsPage, { notify, onRequestConcierge: () => setPermitConciergeOpen(true) });
      case '/kpi':
        return React.createElement(KpiPage, { notify });
      case '/settings':
        return React.createElement(SettingsPage, null);
      case '/onboarding':
        return React.createElement(OnboardingPage, null);
      case '/loan-pack':
        return React.createElement(LoanPackPage, { onOpen: () => setLoanPackOpen(true) });
      case '/permit-concierge':
        return React.createElement(PermitConciergePage, { onOpen: () => setPermitConciergeOpen(true) });
      case '/cohort':
        return React.createElement(CohortPage, null);
      default:
        return React.createElement(DashboardPage, { actions });
    }
  };

  const drawer = React.createElement(
    Box,
    { sx: { width: 240 } },
    React.createElement(
      Toolbar,
      null,
      React.createElement(Typography, { variant: 'subtitle1', sx: { fontWeight: 600 } }, 'プロジェクトナビ')
    ),
    React.createElement(Divider, null),
    React.createElement(
      List,
      null,
      navItems.map((item) =>
        React.createElement(
          ListItemButton,
          {
            key: item.path,
            selected: route === item.path,
            onClick: () => handleNavigate(item.path)
          },
          React.createElement(ListItemIcon, null, React.createElement(item.icon, null)),
          React.createElement(ListItemText, { primary: item.label })
        )
      )
    ),
    React.createElement(Divider, null),
    React.createElement(
      List,
      null,
      [
        { label: 'Onboarding', icon: Icons.RocketLaunch, path: '#/onboarding' },
        { label: 'Loan Pack', icon: Icons.CreditScore, path: '#/loan-pack' },
        { label: 'Permit Concierge', icon: Icons.Assistant, path: '#/permit-concierge' },
        { label: 'Cohort', icon: Icons.School, path: '#/cohort' }
      ].map((item) =>
        React.createElement(
          ListItemButton,
          {
            key: item.path,
            selected: route === item.path,
            onClick: () => handleNavigate(item.path)
          },
          React.createElement(ListItemIcon, null, React.createElement(item.icon, null)),
          React.createElement(ListItemText, { primary: item.label })
        )
      )
    )
  );

  return React.createElement(
    Box,
    { sx: { display: 'flex' } },
    React.createElement(
      AppBar,
      { position: 'fixed', sx: { zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'primary.main' } },
      React.createElement(
        Toolbar,
        null,
        React.createElement(
          IconButton,
          {
            color: 'inherit',
            edge: 'start',
            sx: { mr: 2, display: { md: 'none' } },
            onClick: () => setMobileOpen(!mobileOpen),
            'aria-label': 'メニューを開く'
          },
          React.createElement(Icons.Menu, null)
        ),
        React.createElement(Typography, { variant: 'h6', sx: { flexGrow: 0, fontWeight: 700 } }, '起業OS（協力隊）'),
        React.createElement(
          Box,
          { sx: { flexGrow: 1, mx: 3, display: { xs: 'none', sm: 'block' } } },
          React.createElement(TextField, {
            size: 'small',
            placeholder: '検索（ダミー）',
            sx: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, minWidth: 240 },
            InputProps: { sx: { color: 'white' } }
          })
        ),
        React.createElement(
          Button,
          { color: 'inherit', onClick: () => setPricingOpen(true), 'aria-label': 'アップグレード' },
          `アップグレード (${pricingTier})`
        ),
        React.createElement(
          Button,
          {
            color: 'inherit',
            onClick: () => setSignInOpen(true),
            sx: { ml: 1 },
            variant: 'outlined',
            'aria-label': 'サインイン'
          },
          'サインイン'
        )
      )
    ),
    React.createElement(
      Box,
      { component: 'nav', sx: { width: { md: 240 }, flexShrink: { md: 0 } }, 'aria-label': 'メインナビゲーション' },
      React.createElement(
        Drawer,
        {
          variant: 'temporary',
          open: mobileOpen,
          onClose: () => setMobileOpen(false),
          ModalProps: { keepMounted: true },
          sx: { display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 240 } }
        },
        drawer
      ),
      React.createElement(
        Drawer,
        {
          variant: 'permanent',
          open: true,
          sx: { display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }
        },
        drawer
      )
    ),
    React.createElement(
      Box,
      { component: 'main', sx: { flexGrow: 1, mt: 8, minHeight: '100vh', backgroundColor: '#f5f7f5' } },
      React.createElement(
        Box,
        { sx: { p: 2 } },
        React.createElement(
          Container,
          { maxWidth: 'xl' },
          React.createElement(
            Grid,
            { container: true, spacing: 2 },
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(AIChatCard, { messages: chatMessages, setMessages: setChatMessages })
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 6 },
              React.createElement(InfoTabs, { messages: chatMessages, changeLog, approvals, tasks, setTasks })
            )
          )
        )
      ),
      React.createElement(Box, { sx: { p: 3 } }, renderContent())
    ),
    snackbarElement,
    React.createElement(SignInDialog, { open: signInOpen, onClose: () => setSignInOpen(false) }),
    React.createElement(PricingDialog, {
      open: pricingOpen,
      onClose: () => setPricingOpen(false),
      currentTier: pricingTier,
      onSelect: (tier) => {
        setPricingTier(tier);
        notify(`${tier}プランに切り替えました（ダミー）`);
        setPricingOpen(false);
      }
    }),
    React.createElement(LoanPackModal, { open: loanPackOpen, onClose: () => setLoanPackOpen(false), notify }),
    React.createElement(PermitConciergeModal, { open: permitConciergeOpen, onClose: () => setPermitConciergeOpen(false), notify })
  );
}

function Root() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: { main: '#1b5e20' },
          secondary: { main: '#3b6ea5' }
        },
        shape: { borderRadius: 10 },
        typography: {
          h5: { fontWeight: 600 },
          body1: { fontSize: '0.95rem' }
        }
      }),
    []
  );

  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(CssBaseline, null),
    React.createElement(DataProvider, null, React.createElement(App, null))
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Root, null));
