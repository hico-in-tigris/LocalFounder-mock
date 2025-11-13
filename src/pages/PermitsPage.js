import { React, MaterialUI, MaterialUIIcons } from '../shared/react.js';
import { useDataContext } from '../context/data-context.js';
import { formatCurrency } from '../lib/utils.js';

const { useState } = React;
const Icons = MaterialUIIcons;
const {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} = MaterialUI;

export default function PermitsPage({ notify, onRequestConcierge }) {
  const { permitTemplates, permitTasks, setPermitTasks } = useDataContext();
  const [industry, setIndustry] = useState('宿泊');

  const tasks = permitTasks[industry] || [];

  const updateStatus = (taskId, status) => {
    const updated = { ...permitTasks, [industry]: tasks.map((task) => (task.id === taskId ? { ...task, status } : task)) };
    setPermitTasks(updated);
    notify('進捗を更新しました');
  };

  const completion = tasks.length ? Math.round((tasks.filter((task) => task.status === 'Approved').length / tasks.length) * 100) : 0;
  const todoCount = tasks.filter((task) => task.status === 'Todo').length;

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      { spacing: 2 },
      React.createElement(Typography, { variant: 'h5' }, '許認可トラッカー'),
      todoCount >= 2 &&
        React.createElement(
          Card,
          null,
          React.createElement(
            CardContent,
            null,
            React.createElement(
              Stack,
              { direction: { xs: 'column', sm: 'row' }, spacing: 2, alignItems: 'center' },
              React.createElement(Icons.Assistant, { color: 'primary' }),
              React.createElement(
                Box,
                { sx: { flex: 1 } },
                React.createElement(Typography, { variant: 'subtitle1' }, 'Permit Concierge（¥39,800）で専門家に丸投げ'),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'text.secondary' },
                  '未着手タスクが多い場合は、専門家サポートに切り替えて短期取得を目指しましょう。'
                )
              ),
              React.createElement(Button, { variant: 'contained', onClick: onRequestConcierge }, '詳細を見る')
            )
          )
        ),
      React.createElement(
        Card,
        null,
        React.createElement(
          CardContent,
          null,
          React.createElement(
            Stack,
            { direction: { xs: 'column', sm: 'row' }, spacing: 2, alignItems: { xs: 'flex-start', sm: 'center' } },
            React.createElement(
              FormControl,
              { sx: { minWidth: 200 } },
              React.createElement(InputLabel, { id: 'industry-select' }, '業種テンプレを展開'),
              React.createElement(
                Select,
                {
                  labelId: 'industry-select',
                  value: industry,
                  label: '業種テンプレを展開',
                  onChange: (event) => setIndustry(event.target.value)
                },
                Object.keys(permitTemplates).map((key) => React.createElement(MenuItem, { key, value: key }, key))
              )
            ),
            React.createElement(
              Stack,
              { spacing: 1, sx: { flex: 1 } },
              React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, `進捗：${completion}%`),
              React.createElement(LinearProgress, { variant: 'determinate', value: completion })
            )
          )
        )
      ),
      React.createElement(
        TableContainer,
        { component: Paper },
        React.createElement(
          Table,
          { size: 'small' },
          React.createElement(
            TableHead,
            null,
            React.createElement(
              TableRow,
              null,
              ['タスク', '所管', '連絡先', '必要書類', '費用', '審査日数', 'ステータス'].map((head) =>
                React.createElement(TableCell, { key: head }, head)
              )
            )
          ),
          React.createElement(
            TableBody,
            null,
            tasks.map((task) =>
              React.createElement(
                TableRow,
                { key: task.id },
                React.createElement(TableCell, null, task.name),
                React.createElement(TableCell, null, task.agency),
                React.createElement(TableCell, null, task.contact),
                React.createElement(TableCell, null, task.documents),
                React.createElement(TableCell, null, formatCurrency(task.fee)),
                React.createElement(TableCell, null, `${task.eta} 日`),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(
                    Select,
                    {
                      size: 'small',
                      value: task.status,
                      onChange: (event) => updateStatus(task.id, event.target.value),
                      'aria-label': 'ステータス更新'
                    },
                    ['Todo', 'InProgress', 'WaitingReview', 'Approved'].map((status) =>
                      React.createElement(MenuItem, { key: status, value: status }, status)
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
