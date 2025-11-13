import { React, MaterialUI } from '../shared/react.js';
import TabPanel from './TabPanel.js';

const { useState, useMemo } = React;
const {
  Card,
  Box,
  Tabs,
  Tab,
  Stack,
  Typography,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
  Checkbox
} = MaterialUI;

export default function InfoTabs({ messages, changeLog, approvals, tasks, setTasks }) {
  const [tab, setTab] = useState(0);

  const recentMessages = useMemo(() => messages.slice(-3), [messages]);
  const summaryText = recentMessages.length
    ? recentMessages.map((msg) => `${msg.role === 'you' ? 'あなた' : 'AI'}: ${msg.text}`).join(' / ')
    : 'まだ会話がありません。質問してみましょう。';

  const importantTags = useMemo(() => {
    const combined = recentMessages.map((msg) => msg.text).join(' ');
    const tags = [];
    if (combined.includes('許認可')) tags.push('許認可');
    if (combined.includes('融資')) tags.push('資金調達');
    if (combined.includes('PL') || combined.includes('実験')) tags.push('実験→PL反映');
    if (!tags.length) tags.push('タスク整理');
    return Array.from(new Set(tags));
  }, [recentMessages]);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const toggleTask = (taskId) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task)));
  };

  const approvalStatusColor = (status) => {
    if (status.includes('準備')) return 'warning';
    if (status.includes('調整')) return 'info';
    if (status.includes('待ち')) return 'secondary';
    return 'success';
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case '高':
        return 'error';
      case '中':
        return 'warning';
      default:
        return 'default';
    }
  };

  return React.createElement(
    Card,
    { sx: { height: '100%' } },
    React.createElement(
      Box,
      { sx: { borderBottom: 1, borderColor: 'divider' } },
      React.createElement(
        Tabs,
        {
          value: tab,
          onChange: handleTabChange,
          variant: 'scrollable',
          scrollButtons: 'auto',
          'aria-label': '情報タブ'
        },
        ['チャット', '更新履歴', '承認フロー', 'タスク'].map((label, index) =>
          React.createElement(Tab, { key: label, label, id: `info-tab-${index}`, 'aria-controls': `info-tabpanel-${index}` })
        )
      )
    ),
    React.createElement(
      TabPanel,
      { value: tab, index: 0 },
      React.createElement(
        Stack,
        { spacing: 2 },
        React.createElement(Typography, { variant: 'subtitle1' }, '直近の会話サマリー'),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, summaryText),
        React.createElement(Divider, null),
        React.createElement(
          Stack,
          { direction: 'row', spacing: 1, flexWrap: 'wrap' },
          importantTags.map((tag) => React.createElement(Chip, { key: tag, label: tag, color: 'primary', variant: 'outlined' }))
        )
      )
    ),
    React.createElement(
      TabPanel,
      { value: tab, index: 1 },
      React.createElement(
        List,
        { disablePadding: true },
        changeLog.map((item) =>
          React.createElement(
            ListItem,
            { key: item.id, alignItems: 'flex-start', divider: true },
            React.createElement(ListItemText, {
              primary: `${item.title}（${item.date}）`,
              secondary: item.detail
            })
          )
        ),
        changeLog.length === 0
          ? React.createElement(ListItem, null, React.createElement(ListItemText, { primary: 'まだ更新履歴がありません。' }))
          : null
      )
    ),
    React.createElement(
      TabPanel,
      { value: tab, index: 2 },
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
              ['項目', '申請先', '期限', '状態', '進捗'].map((head) => React.createElement(TableCell, { key: head }, head))
            )
          ),
          React.createElement(
            TableBody,
            null,
            approvals.map((row) =>
              React.createElement(
                TableRow,
                { key: row.id },
                React.createElement(TableCell, null, row.item),
                React.createElement(TableCell, null, row.owner),
                React.createElement(TableCell, null, row.due),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(Chip, { label: row.status, color: approvalStatusColor(row.status), size: 'small' })
                ),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(
                    Stack,
                    { spacing: 1 },
                    React.createElement(LinearProgress, { variant: 'determinate', value: row.progress }),
                    React.createElement(Typography, { variant: 'caption', color: 'text.secondary' }, `${row.progress}%`)
                  )
                )
              )
            )
          )
        )
      )
    ),
    React.createElement(
      TabPanel,
      { value: tab, index: 3 },
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
              ['タスク', '優先度', '期限', '担当', '完了'].map((head) => React.createElement(TableCell, { key: head }, head))
            )
          ),
          React.createElement(
            TableBody,
            null,
            tasks.map((task) =>
              React.createElement(
                TableRow,
                { key: task.id },
                React.createElement(TableCell, null, task.title),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(Chip, { label: task.priority, color: priorityColor(task.priority), size: 'small' })
                ),
                React.createElement(TableCell, null, task.due),
                React.createElement(TableCell, null, task.owner),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(Checkbox, {
                    checked: task.done,
                    onChange: () => toggleTask(task.id),
                    inputProps: { 'aria-label': `${task.title}の完了状況` }
                  })
                )
              )
            )
          )
        )
      )
    )
  );
}
