import { React, MaterialUI } from '../shared/react.js';
import { useDataContext } from '../context/data-context.js';
import { formatCurrency } from '../lib/utils.js';

const { useState } = React;
const {
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} = MaterialUI;

export default function KpiPage({ notify }) {
  const { kpiRecords, setKpiRecords } = useDataContext();
  const [period, setPeriod] = useState('直近3ヶ月');
  const [form, setForm] = useState({ month: '', revenue: '', guests: '', bookings: '', survey: '', hires: '', community: '' });

  const handleChange = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const addRecord = () => {
    if (!form.month) return;
    const newRecord = {
      id: `kpi-${Date.now()}`,
      ...Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, key === 'month' ? value : Number(value)])
      )
    };
    setKpiRecords([...kpiRecords, newRecord]);
    notify('KPIを追加しました');
    setForm({ month: '', revenue: '', guests: '', bookings: '', survey: '', hires: '', community: '' });
  };

  const filtered = period === '直近3ヶ月' ? kpiRecords.slice(-3) : kpiRecords;

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      { spacing: 2 },
      React.createElement(
        Stack,
        { direction: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } },
        React.createElement(Typography, { variant: 'h5' }, 'KPIダッシュ'),
        React.createElement(
          FormControl,
          { size: 'small' },
          React.createElement(InputLabel, { id: 'period-select' }, '期間'),
          React.createElement(
            Select,
            {
              labelId: 'period-select',
              value: period,
              label: '期間',
              onChange: (event) => setPeriod(event.target.value)
            },
            ['直近3ヶ月', 'すべて'].map((option) => React.createElement(MenuItem, { key: option, value: option }, option))
          )
        )
      ),
      React.createElement(
        Grid,
        { container: true, spacing: 2 },
        [
          { label: '売上', key: 'revenue', color: 'primary' },
          { label: '来客', key: 'guests', color: 'success' },
          { label: '予約', key: 'bookings', color: 'secondary' },
          { label: 'アンケ満足度', key: 'survey', color: 'warning' },
          { label: '雇用', key: 'hires', color: 'info' },
          { label: 'コミュニティ数', key: 'community', color: 'default' }
        ].map((metric) =>
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 6, md: 4, key: metric.key },
            React.createElement(
              Card,
              null,
              React.createElement(
                CardContent,
                null,
                React.createElement(Typography, { variant: 'subtitle1' }, metric.label),
                React.createElement(
                  Typography,
                  { variant: 'h5' },
                  filtered.length ? filtered[filtered.length - 1][metric.key] : '-'
                )
              )
            )
          )
        )
      ),
      React.createElement(
        Card,
        null,
        React.createElement(
          CardContent,
          null,
          React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true }, '月次KPIを追加'),
          React.createElement(
            Grid,
            { container: true, spacing: 2 },
            ['month', 'revenue', 'guests', 'bookings', 'survey', 'hires', 'community'].map((field) =>
              React.createElement(
                Grid,
                { item: true, xs: 12, sm: 6, md: 3, key: field },
                React.createElement(TextField, {
                  label: field === 'month' ? '月 (YYYY-MM)' : field,
                  type: field === 'month' ? 'text' : 'number',
                  value: form[field],
                  onChange: handleChange(field)
                })
              )
            )
          ),
          React.createElement(
            Box,
            { sx: { mt: 2, textAlign: 'right' } },
            React.createElement(Button, { variant: 'contained', onClick: addRecord }, '追加')
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
              ['月', '売上', '来客', '予約', 'アンケ', '雇用', 'コミュニティ'].map((head) =>
                React.createElement(TableCell, { key: head }, head)
              )
            )
          ),
          React.createElement(
            TableBody,
            null,
            kpiRecords.map((record) =>
              React.createElement(
                TableRow,
                { key: record.id },
                React.createElement(TableCell, null, record.month),
                React.createElement(TableCell, null, formatCurrency(record.revenue)),
                React.createElement(TableCell, null, record.guests),
                React.createElement(TableCell, null, record.bookings),
                React.createElement(TableCell, null, record.survey),
                React.createElement(TableCell, null, record.hires),
                React.createElement(TableCell, null, record.community)
              )
            )
          )
        )
      )
    )
  );
}
