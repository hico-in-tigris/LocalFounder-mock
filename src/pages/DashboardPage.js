import { React, MaterialUI } from '../shared/react.js';
import { useDataContext } from '../context/data-context.js';
import { remainingDays } from '../lib/utils.js';

const {
  Box,
  Grid,
  Card,
  Typography,
  Chip,
  CardContent,
  CardActions,
  Stack,
  Button
} = MaterialUI;

export default function DashboardPage({ actions }) {
  const { startupProfile, experiments } = useDataContext();
  const remaining = remainingDays(startupProfile.termStart, startupProfile.termEnd);
  const upcomingApplications = [
    { id: 'app-1', name: '小規模事業者持続化補助金', deadline: '2024-06-21', note: '様式下書きあり' },
    { id: 'app-2', name: '観光地域新サービス補助', deadline: '2024-07-05', note: '書類ドラフト中' }
  ];
  const inProgressCounts = experiments.reduce((acc, exp) => {
    acc[exp.status] = (acc[exp.status] || 0) + 1;
    return acc;
  }, {});
  const statusChips = [
    { label: '進行中', key: 'Running', color: 'primary' },
    { label: '検証待ち', key: 'Completed', color: 'secondary' },
    { label: '学び反映待ち', key: 'Learned', color: 'success' }
  ];
  const learnings = experiments.filter((exp) => exp.status === 'Learned');

  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Grid,
      { container: true, spacing: 3 },
      React.createElement(
        Grid,
        { item: true, xs: 12, md: 8 },
        React.createElement(
          Grid,
          { container: true, spacing: 3 },
          React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(
              Card,
              { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 } },
              React.createElement(
                Box,
                null,
                React.createElement(
                  Typography,
                  { variant: 'h6' },
                  `任期：${startupProfile.termStart}〜${startupProfile.termEnd}`
                ),
                React.createElement(
                  Typography,
                  { variant: 'body2', color: 'text.secondary' },
                  `残り ${remaining} 日`
                )
              ),
              React.createElement(Chip, { label: startupProfile.goal, color: 'success', variant: 'outlined' })
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(Typography, { variant: 'h6', sx: { mb: 1 } }, '今週の3アクション'),
            React.createElement(
              Grid,
              { container: true, spacing: 2 },
              actions.map((action, idx) =>
                React.createElement(
                  Grid,
                  { item: true, xs: 12, md: 4, key: idx },
                  React.createElement(
                    Card,
                    { sx: { height: '100%' } },
                    React.createElement(
                      CardContent,
                      null,
                      React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true }, action.title),
                      React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, action.reason)
                    ),
                    React.createElement(
                      CardActions,
                      null,
                      React.createElement(Button, { size: 'small', variant: 'contained', color: 'primary' }, action.cta)
                    )
                  )
                )
              )
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(
              Card,
              null,
              React.createElement(
                CardContent,
                null,
                React.createElement(Typography, { variant: 'h6', gutterBottom: true }, '実験サマリー'),
                React.createElement(
                  Stack,
                  { direction: { xs: 'column', sm: 'row' }, spacing: 2 },
                  statusChips.map((chip) =>
                    React.createElement(
                      Card,
                      { key: chip.key, sx: { flex: 1, p: 2 } },
                      React.createElement(
                        Stack,
                        { direction: 'row', spacing: 1, alignItems: 'center' },
                        React.createElement(Chip, { label: chip.label, color: chip.color }),
                        React.createElement(Typography, { variant: 'h5' }, inProgressCounts[chip.key] || 0)
                      )
                    )
                  )
                )
              )
            )
          ),
          React.createElement(
            Grid,
            { item: true, xs: 12 },
            React.createElement(
              Card,
              null,
              React.createElement(
                CardContent,
                null,
                React.createElement(Typography, { variant: 'h6', gutterBottom: true }, '申請タイムライン'),
                React.createElement(
                  Stack,
                  { spacing: 2 },
                  upcomingApplications.map((item) =>
                    React.createElement(
                      Card,
                      { key: item.id, variant: 'outlined' },
                      React.createElement(
                        CardContent,
                        null,
                        React.createElement(Typography, { variant: 'subtitle1' }, item.name),
                        React.createElement(
                          Typography,
                          { variant: 'body2', color: 'text.secondary' },
                          `次の締切まで7日：${item.name}（${item.note}）`
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),
      React.createElement(
        Grid,
        { item: true, xs: 12, md: 4 },
        React.createElement(
          Stack,
          { spacing: 2 },
          React.createElement(
            Card,
            null,
            React.createElement(
              CardContent,
              null,
              React.createElement(Typography, { variant: 'h6' }, '最近の学び要約'),
              learnings.slice(0, 2).map((exp) =>
                React.createElement(
                  Box,
                  { key: exp.id, sx: { mb: 1 } },
                  React.createElement(Typography, { variant: 'subtitle2' }, exp.title),
                  React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, exp.notes)
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
              React.createElement(Typography, { variant: 'h6' }, 'To-Apply'),
              upcomingApplications.map((app) =>
                React.createElement(
                  Box,
                  { key: app.id, sx: { mb: 1 } },
                  React.createElement(Typography, { variant: 'subtitle2' }, app.name),
                  React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, `${app.deadline} 締切に向けて準備`)
                )
              )
            )
          )
        )
      )
    )
  );
}
