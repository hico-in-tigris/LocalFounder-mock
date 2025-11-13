import { React, MaterialUI, MaterialUIIcons } from '../shared/react.js';
import mockAI from '../lib/mock-ai.js';
import { useDataContext } from '../context/data-context.js';
import { formatCurrency } from '../lib/utils.js';

const { useState, useEffect, Fragment } = React;
const Icons = MaterialUIIcons;
const {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  Box,
  Typography,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  FormControlLabel,
  Switch
} = MaterialUI;

function ExperimentDialog({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(() =>
    initial || {
      title: '',
      hypothesis: '',
      startDate: '',
      endDate: '',
      cost: '',
      revenue: '',
      bookings: '',
      survey: '',
      notes: '',
      status: 'Draft'
    }
  );

  useEffect(() => {
    if (open) {
      setForm(
        initial || {
          title: '',
          hypothesis: '',
          startDate: '',
          endDate: '',
          cost: '',
          revenue: '',
          bookings: '',
          survey: '',
          notes: '',
          status: 'Draft'
        }
      );
    }
  }, [open, initial]);

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return React.createElement(
    Dialog,
    { open, onClose, fullWidth: true, maxWidth: 'sm' },
    React.createElement(DialogTitle, null, initial ? '実験を編集' : '実験を追加'),
    React.createElement(
      DialogContent,
      { dividers: true },
      React.createElement(
        Stack,
        { spacing: 2, sx: { mt: 1 } },
        React.createElement(TextField, { label: 'タイトル', value: form.title, onChange: handleChange('title'), fullWidth: true }),
        React.createElement(TextField, {
          label: '仮説',
          value: form.hypothesis,
          onChange: handleChange('hypothesis'),
          multiline: true,
          rows: 2
        }),
        React.createElement(
          Stack,
          { direction: { xs: 'column', sm: 'row' }, spacing: 2 },
          React.createElement(TextField, {
            label: '開始日',
            type: 'date',
            value: form.startDate,
            onChange: handleChange('startDate'),
            InputLabelProps: { shrink: true },
            fullWidth: true
          }),
          React.createElement(TextField, {
            label: '終了日',
            type: 'date',
            value: form.endDate,
            onChange: handleChange('endDate'),
            InputLabelProps: { shrink: true },
            fullWidth: true
          })
        ),
        React.createElement(
          Stack,
          { direction: { xs: 'column', sm: 'row' }, spacing: 2 },
          React.createElement(TextField, { label: 'コスト', type: 'number', value: form.cost, onChange: handleChange('cost'), fullWidth: true }),
          React.createElement(TextField, { label: '売上', type: 'number', value: form.revenue, onChange: handleChange('revenue'), fullWidth: true })
        ),
        React.createElement(
          Stack,
          { direction: { xs: 'column', sm: 'row' }, spacing: 2 },
          React.createElement(TextField, { label: '予約', type: 'number', value: form.bookings, onChange: handleChange('bookings'), fullWidth: true }),
          React.createElement(TextField, { label: 'アンケ', type: 'number', value: form.survey, onChange: handleChange('survey'), fullWidth: true })
        ),
        React.createElement(TextField, { label: 'メモ', value: form.notes, onChange: handleChange('notes'), multiline: true, rows: 3 }),
        React.createElement(
          FormControl,
          { fullWidth: true },
          React.createElement(InputLabel, { id: 'status-label' }, '状態'),
          React.createElement(
            Select,
            { labelId: 'status-label', label: '状態', value: form.status, onChange: handleChange('status') },
            ['Draft', 'Running', 'Completed', 'Learned', 'Reflected'].map((status) =>
              React.createElement(MenuItem, { key: status, value: status }, status)
            )
          )
        )
      )
    ),
    React.createElement(
      DialogActions,
      null,
      React.createElement(Button, { onClick: onClose }, 'キャンセル'),
      React.createElement(Button, { onClick: handleSubmit, variant: 'contained' }, '保存')
    )
  );
}

function ExperimentSummaryDrawer({ open, onClose, experiment }) {
  const summary = experiment ? mockAI.summarizeExperiment(experiment) : null;
  return React.createElement(
    Drawer,
    { anchor: 'right', open, onClose, PaperProps: { sx: { width: { xs: '100%', sm: 360 } } } },
    React.createElement(
      Box,
      { sx: { p: 3 } },
      experiment &&
        React.createElement(
          Fragment,
          null,
          React.createElement(Typography, { variant: 'h6', gutterBottom: true }, `${experiment.title} のAI学び要約`),
          React.createElement(Typography, { variant: 'subtitle2', sx: { mt: 2 } }, 'summaryAI'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, summary.summaryAI),
          React.createElement(Typography, { variant: 'subtitle2', sx: { mt: 2 } }, 'nextActionAI'),
          React.createElement(
            Stack,
            { spacing: 1 },
            summary.nextActionAI.map((item, idx) => React.createElement(Chip, { key: idx, label: item }))
          ),
          React.createElement(Typography, { variant: 'subtitle2', sx: { mt: 2 } }, 'tags'),
          React.createElement(
            Stack,
            { direction: 'row', spacing: 1, flexWrap: 'wrap' },
            summary.tags.map((tag, idx) => React.createElement(Chip, { key: idx, label: tag, color: 'secondary', variant: 'outlined' }))
          )
        )
    )
  );
}

export default function ExperimentsPage({ notify }) {
  const { experiments, setExperiments } = useDataContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [drawerExp, setDrawerExp] = useState(null);

  const handleSave = (form) => {
    if (!form.title) return;
    if (editing) {
      setExperiments(experiments.map((exp) => (exp.id === editing.id ? { ...editing, ...form } : exp)));
      notify('実験を更新しました');
    } else {
      const newExp = { ...form, id: `exp-${Date.now()}` };
      setExperiments([...experiments, newExp]);
      notify('実験を追加しました');
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    setExperiments(experiments.filter((exp) => exp.id !== id));
    notify('実験を削除しました');
  };

  const renderTable = () =>
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
            ['タイトル', '期間', 'コスト', '売上', '予約', 'アンケ', '状態', ''].map((head) =>
              React.createElement(TableCell, { key: head }, head)
            )
          )
        ),
        React.createElement(
          TableBody,
          null,
          experiments.map((exp) =>
            React.createElement(
              TableRow,
              { key: exp.id },
              React.createElement(TableCell, null, exp.title),
              React.createElement(TableCell, null, `${exp.startDate}〜${exp.endDate}`),
              React.createElement(TableCell, null, formatCurrency(exp.cost)),
              React.createElement(TableCell, null, formatCurrency(exp.revenue)),
              React.createElement(TableCell, null, exp.bookings),
              React.createElement(TableCell, null, exp.survey),
              React.createElement(TableCell, null, exp.status),
              React.createElement(
                TableCell,
                { align: 'right' },
                React.createElement(
                  Stack,
                  { direction: 'row', spacing: 1, justifyContent: 'flex-end' },
                  React.createElement(
                    Button,
                    { size: 'small', variant: 'outlined', onClick: () => { setEditing(exp); setDialogOpen(true); } },
                    '編集'
                  ),
                  React.createElement(
                    Button,
                    { size: 'small', variant: 'text', onClick: () => handleDelete(exp.id) },
                    '削除'
                  ),
                  React.createElement(
                    Button,
                    { size: 'small', variant: 'contained', onClick: () => setDrawerExp(exp) },
                    'AI学び要約'
                  )
                )
              )
            )
          )
        )
      )
    );

  const statuses = ['Draft', 'Running', 'Completed', 'Learned', 'Reflected'];
  const renderKanban = () =>
    React.createElement(
      Grid,
      { container: true, spacing: 2 },
      statuses.map((status) =>
        React.createElement(
          Grid,
          { item: true, xs: 12, md: 12 / statuses.length, key: status },
          React.createElement(
            Card,
            { sx: { minHeight: 240 } },
            React.createElement(
              CardContent,
              null,
              React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true }, status),
              React.createElement(
                Stack,
                { spacing: 1 },
                experiments
                  .filter((exp) => exp.status === status)
                  .map((exp) =>
                    React.createElement(
                      Card,
                      { key: exp.id, variant: 'outlined' },
                      React.createElement(
                        CardContent,
                        null,
                        React.createElement(Typography, { variant: 'subtitle2' }, exp.title),
                        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, exp.hypothesis),
                        React.createElement(
                          Stack,
                          { direction: 'row', spacing: 1, sx: { mt: 1 } },
                          React.createElement(Button, { size: 'small', onClick: () => { setEditing(exp); setDialogOpen(true); } }, '編集'),
                          React.createElement(Button, { size: 'small', onClick: () => setDrawerExp(exp) }, 'AI要約')
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

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      {
        direction: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        spacing: 2,
        sx: { mb: 2 }
      },
      React.createElement(Typography, { variant: 'h5' }, '実験ログ'),
      React.createElement(
        Stack,
        { direction: 'row', spacing: 1, alignItems: 'center' },
        React.createElement(FormControlLabel, {
          control: React.createElement(Switch, {
            checked: viewMode === 'kanban',
            onChange: () => setViewMode(viewMode === 'table' ? 'kanban' : 'table')
          }),
          label: viewMode === 'kanban' ? 'Kanban' : 'Table'
        }),
        React.createElement(
          Button,
          {
            variant: 'contained',
            startIcon: React.createElement(Icons.Add, null),
            onClick: () => setDialogOpen(true),
            'aria-label': '実験を追加'
          },
          '+ 実験を追加'
        )
      )
    ),
    viewMode === 'table' ? renderTable() : renderKanban(),
    React.createElement(ExperimentDialog, {
      open: dialogOpen,
      onClose: () => {
        setDialogOpen(false);
        setEditing(null);
      },
      onSave: handleSave,
      initial: editing
    }),
    React.createElement(ExperimentSummaryDrawer, {
      open: Boolean(drawerExp),
      onClose: () => setDrawerExp(null),
      experiment: drawerExp
    })
  );
}
