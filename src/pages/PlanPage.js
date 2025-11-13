import { React, MaterialUI } from '../shared/react.js';
import { useDataContext } from '../context/data-context.js';
import { formatCurrency } from '../lib/utils.js';

const { Box, Typography, Grid, Card, CardContent, TextField, Stack, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } = MaterialUI;

export default function PlanPage({ notify }) {
  const { bmcNotes, setBmcNotes, plData, setPlData, experiments } = useDataContext();

  const handleBmcChange = (key) => (event) => {
    setBmcNotes({ ...bmcNotes, [key]: event.target.value });
  };

  const handlePLChange = (idx, field) => (event) => {
    const updated = plData.map((row, i) => (i === idx ? { ...row, [field]: Number(event.target.value) } : row));
    setPlData(updated);
  };

  const grossSeries = plData.map((row) => row.revenue - row.cogs - row.opex);

  const reflectExperiments = () => {
    const deltaRevenue = experiments
      .filter((exp) => ['Completed', 'Learned'].includes(exp.status))
      .reduce((sum, exp) => sum + Number(exp.revenue || 0) * 0.02, 0);
    const deltaCost = experiments
      .filter((exp) => exp.status === 'Running')
      .reduce((sum, exp) => sum + Number(exp.cost || 0) * 0.01, 0);
    const updated = plData.map((row) => ({
      ...row,
      revenue: Math.round(row.revenue + deltaRevenue),
      cogs: Math.round(row.cogs + deltaCost)
    }));
    setPlData(updated);
    notify('実験実績を反映しました（ダミー）');
  };

  const bmcLabels = {
    KeyPartners: 'Key Partners',
    KeyActivities: 'Key Activities',
    KeyResources: 'Key Resources',
    ValuePropositions: 'Value Propositions',
    CustomerRelationships: 'Customer Relationships',
    Channels: 'Channels',
    CustomerSegments: 'Customer Segments',
    CostStructure: 'Cost Structure',
    RevenueStreams: 'Revenue Streams'
  };

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(Typography, { variant: 'h5', sx: { mb: 2 } }, '事業計画'),
    React.createElement(
      Grid,
      { container: true, spacing: 2 },
      Object.keys(bmcLabels).map((key) =>
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 4, key },
          React.createElement(
            Card,
            null,
            React.createElement(
              CardContent,
              null,
              React.createElement(Typography, { variant: 'subtitle1' }, bmcLabels[key]),
              React.createElement(TextField, {
                value: bmcNotes[key] || '',
                onChange: handleBmcChange(key),
                multiline: true,
                minRows: 3,
                fullWidth: true
              })
            )
          )
        )
      )
    ),
    React.createElement(
      Box,
      { sx: { mt: 4 } },
      React.createElement(
        Stack,
        {
          direction: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          sx: { mb: 2 }
        },
        React.createElement(Typography, { variant: 'h6' }, '6ヶ月PL'),
        React.createElement(Button, { variant: 'contained', onClick: reflectExperiments }, '実験実績を反映')
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
              ['月', '売上', '原価', '販管費', '粗利'].map((head) => React.createElement(TableCell, { key: head }, head))
            )
          ),
          React.createElement(
            TableBody,
            null,
            plData.map((row, idx) =>
              React.createElement(
                TableRow,
                { key: row.month },
                React.createElement(TableCell, null, row.month),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(TextField, {
                    type: 'number',
                    value: row.revenue,
                    onChange: handlePLChange(idx, 'revenue'),
                    size: 'small'
                  })
                ),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(TextField, {
                    type: 'number',
                    value: row.cogs,
                    onChange: handlePLChange(idx, 'cogs'),
                    size: 'small'
                  })
                ),
                React.createElement(
                  TableCell,
                  null,
                  React.createElement(TextField, {
                    type: 'number',
                    value: row.opex,
                    onChange: handlePLChange(idx, 'opex'),
                    size: 'small'
                  })
                ),
                React.createElement(TableCell, null, formatCurrency(row.revenue - row.cogs - row.opex))
              )
            )
          )
        )
      ),
      React.createElement(
        Box,
        { sx: { mt: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2 } },
        React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true }, '粗利トレンド（簡易）'),
        React.createElement(
          Box,
          { sx: { display: 'flex', alignItems: 'flex-end', gap: 1, height: 160 } },
          grossSeries.map((value, idx) =>
            React.createElement(Box, {
              key: idx,
              sx: {
                flex: 1,
                backgroundColor: 'primary.main',
                opacity: 0.7,
                height: `${Math.max(10, value / 2000)}%`,
                borderRadius: 1
              }
            })
          )
        )
      )
    )
  );
}
