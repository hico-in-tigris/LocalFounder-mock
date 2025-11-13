import { React, MaterialUI } from '../shared/react.js';

const {
  Box,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Button
} = MaterialUI;

export function OnboardingPage() {
  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      { spacing: 2 },
      React.createElement(Typography, { variant: 'h5' }, '初回セットアップ'),
      React.createElement(Typography, { variant: 'body1' }, '任期や目標を入力してダッシュボードをカスタマイズしましょう。'),
      React.createElement(
        Stepper,
        { orientation: 'vertical', activeStep: 1 },
        ['プロジェクト情報', '実験の登録', 'Funding候補', '許認可テンプレ確認'].map((label, idx) =>
          React.createElement(Step, { key: idx, active: idx <= 1 }, React.createElement(StepLabel, null, label))
        )
      )
    )
  );
}

export function LoanPackPage({ onOpen }) {
  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        null,
        React.createElement(Typography, { variant: 'h5', gutterBottom: true }, 'Loan Pack'),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, '資金調達用に必要書類・テンプレートをまとめたチェックアウトウィザードです。'),
        React.createElement(Button, { sx: { mt: 2 }, variant: 'contained', onClick: onOpen }, 'モーダルを開く')
      )
    )
  );
}

export function PermitConciergePage({ onOpen }) {
  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Card,
      null,
      React.createElement(
        CardContent,
        null,
        React.createElement(Typography, { variant: 'h5', gutterBottom: true }, 'Permit Concierge'),
        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, '未着手タスクを専門家と解決するダミー相談導線です。'),
        React.createElement(Button, { sx: { mt: 2 }, variant: 'contained', onClick: onOpen }, 'モーダルを開く')
      )
    )
  );
}

export function CohortPage() {
  const weeks = [
    { week: 'Week1', focus: '地域資源の棚卸しと仮説整理' },
    { week: 'Week2', focus: '実験設計とフィールドテスト' },
    { week: 'Week3', focus: 'AI分析で学び抽出' },
    { week: 'Week4', focus: 'Funding資料ドラフト' },
    { week: 'Week5', focus: '許認可＆手続きクリア' },
    { week: 'Week6', focus: '実装計画とピッチ練習' }
  ];
  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      { spacing: 2 },
      React.createElement(Typography, { variant: 'h5' }, '6週間ブートキャンプ概要'),
      weeks.map((item) =>
        React.createElement(
          Card,
          { key: item.week },
          React.createElement(
            CardContent,
            null,
            React.createElement(Typography, { variant: 'subtitle1' }, item.week),
            React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, item.focus)
          )
        )
      )
    )
  );
}

export function SettingsPage() {
  return React.createElement(
    Box,
    { sx: { p: 3 } },
    React.createElement(
      Stack,
      { spacing: 2 },
      React.createElement(Typography, { variant: 'h5' }, '設定'),
      React.createElement(
        Card,
        null,
        React.createElement(
          CardContent,
          null,
          React.createElement(Typography, { variant: 'subtitle1' }, 'プロフィール'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, '表示名や連絡先を編集（ダミー）')
        )
      ),
      React.createElement(
        Card,
        null,
        React.createElement(
          CardContent,
          null,
          React.createElement(Typography, { variant: 'subtitle1' }, '請求'),
          React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, '請求履歴はアップグレード後に表示されます。')
        )
      )
    )
  );
}
