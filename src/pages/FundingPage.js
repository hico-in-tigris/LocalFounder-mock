import { React, MaterialUI, MaterialUIIcons } from '../shared/react.js';
import { useDataContext } from '../context/data-context.js';
import { scoreFunding } from '../lib/mock-ai.js';

const { useState } = React;
const Icons = MaterialUIIcons;
const {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Badge,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel
} = MaterialUI;

export default function FundingPage({ notify, onRequestLoanPack }) {
  const { startupProfile, fundingPrograms, kpiRecords, permitTasks } = useDataContext();
  const [filters, setFilters] = useState({ industry: '全て', stage: '全て' });
  const [scoreMap, setScoreMap] = useState({});
  const [stepperOpen, setStepperOpen] = useState(false);
  const [stepperProgram, setStepperProgram] = useState(null);

  const filteredPrograms = fundingPrograms.filter((program) => {
    const matchIndustry = filters.industry === '全て' || program.industry === filters.industry;
    const matchStage = filters.stage === '全て' || program.stage === filters.stage;
    return matchIndustry && matchStage;
  });

  const handleScore = (program) => {
    const score = scoreFunding(startupProfile, program, kpiRecords, permitTasks);
    setScoreMap((prev) => ({ ...prev, [program.id]: score }));
    notify(`「${program.name}」の適合度は ${score} です`);
  };

  const lowScoreExists = Object.values(scoreMap).some((score) => score < 60);

  const openStepper = (program) => {
    setStepperProgram(program);
    setStepperOpen(true);
  };

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      { spacing: 2 },
      React.createElement(Typography, { variant: 'h5' }, '資金調達ナビ'),
      React.createElement(
        Card,
        null,
        React.createElement(
          CardContent,
          null,
          React.createElement(
            Grid,
            { container: true, spacing: 2 },
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 4 },
              React.createElement(TextField, { label: '所在地', value: '北海道', InputProps: { readOnly: true } })
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 4 },
              React.createElement(
                FormControl,
                { fullWidth: true },
                React.createElement(InputLabel, { id: 'industry-filter' }, '業種'),
                React.createElement(
                  Select,
                  {
                    labelId: 'industry-filter',
                    label: '業種',
                    value: filters.industry,
                    onChange: (event) => setFilters({ ...filters, industry: event.target.value })
                  },
                  React.createElement(MenuItem, { value: '全て' }, '全て'),
                  ['飲食', '宿泊', 'IT', '観光体験'].map((item) =>
                    React.createElement(MenuItem, { key: item, value: item }, item)
                  )
                )
              )
            ),
            React.createElement(
              Grid,
              { item: true, xs: 12, md: 4 },
              React.createElement(
                FormControl,
                { fullWidth: true },
                React.createElement(InputLabel, { id: 'stage-filter' }, '段階'),
                React.createElement(
                  Select,
                  {
                    labelId: 'stage-filter',
                    label: '段階',
                    value: filters.stage,
                    onChange: (event) => setFilters({ ...filters, stage: event.target.value })
                  },
                  React.createElement(MenuItem, { value: '全て' }, '全て'),
                  ['Idea', 'Running', 'Opening予定'].map((item) =>
                    React.createElement(MenuItem, { key: item, value: item }, item)
                  )
                )
              )
            )
          )
        )
      ),
      lowScoreExists &&
        React.createElement(
          Card,
          { sx: { borderLeft: (theme) => `4px solid ${theme.palette.secondary.main}` } },
          React.createElement(
            CardContent,
            null,
            React.createElement(
              Stack,
              { direction: { xs: 'column', sm: 'row' }, alignItems: 'center', spacing: 2 },
              React.createElement(Icons.CreditScore, { color: 'warning' }),
              React.createElement(
                Box,
                { sx: { flex: 1 } },
                React.createElement(Typography, { variant: 'subtitle1' }, 'Loan Pack（¥49,800）で資金戦略を強化しませんか？'),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'text.secondary' },
                  '低いスコアの補助金に備え、チェックアウト風ウィザードで必要情報を整理できます。'
                )
              ),
              React.createElement(Button, { variant: 'contained', color: 'secondary', onClick: onRequestLoanPack }, '詳細を見る')
            )
          )
        ),
      React.createElement(
        Grid,
        { container: true, spacing: 2 },
        filteredPrograms.map((program) =>
          React.createElement(
            Grid,
            { item: true, xs: 12, md: 6, key: program.id },
            React.createElement(
              Card,
              null,
              React.createElement(
                CardContent,
                null,
                React.createElement(
                  Stack,
                  { direction: 'row', justifyContent: 'space-between', alignItems: 'center' },
                  React.createElement(
                    Box,
                    null,
                    React.createElement(Typography, { variant: 'h6' }, program.name),
                    React.createElement(
                      Typography,
                      { variant: 'body2', color: 'text.secondary' },
                      `${program.type} / 締切 ${program.deadline}`
                    )
                  ),
                  scoreMap[program.id] !== undefined
                    ? React.createElement(Badge, {
                        color: scoreMap[program.id] >= 70 ? 'primary' : 'warning',
                        badgeContent: `適合度 ${scoreMap[program.id]}`
                      })
                    : null
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'text.secondary', sx: { mt: 1 } },
                  '適合スコアを計算'
                )
              ),
              React.createElement(
                CardActions,
                { sx: { justifyContent: 'space-between' } },
                React.createElement(Button, { variant: 'outlined', onClick: () => handleScore(program) }, '適合スコアを計算'),
                React.createElement(Button, { variant: 'contained', color: 'primary', onClick: () => openStepper(program) }, '申請タスクを展開')
              )
            )
          )
        )
      ),
      React.createElement(
        Dialog,
        { open: stepperOpen, onClose: () => setStepperOpen(false), maxWidth: 'sm', fullWidth: true },
        React.createElement(DialogTitle, null, stepperProgram ? `${stepperProgram.name} の提出タスク` : ''),
        React.createElement(
          DialogContent,
          null,
          stepperProgram &&
            React.createElement(
              Stepper,
              { orientation: 'vertical' },
              stepperProgram.tasks.map((task, idx) =>
                React.createElement(
                  Step,
                  { key: idx, active: true },
                  React.createElement(StepLabel, null, task)
                )
              )
            )
        ),
        React.createElement(
          DialogActions,
          null,
          React.createElement(Button, { onClick: () => setStepperOpen(false) }, '閉じる'),
          React.createElement(
            Button,
            {
              onClick: () => {
                setStepperOpen(false);
                notify('タスクチェックを保存しました（ダミー）');
              }
            },
            'チェック完了'
          )
        )
      )
    )
  );
}
