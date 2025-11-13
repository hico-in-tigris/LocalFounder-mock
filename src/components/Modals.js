import { React, MaterialUI } from '../shared/react.js';

const { useState, useEffect, Fragment } = React;
const {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  Checkbox
} = MaterialUI;

export function SignInDialog({ open, onClose }) {
  return React.createElement(
    Dialog,
    { open, onClose, maxWidth: 'xs', fullWidth: true },
    React.createElement(DialogTitle, null, 'サインイン'),
    React.createElement(
      DialogContent,
      null,
      React.createElement(
        Stack,
        { spacing: 2, sx: { mt: 1 } },
        React.createElement(TextField, { label: 'メールアドレス', type: 'email', fullWidth: true }),
        React.createElement(TextField, { label: 'パスワード', type: 'password', fullWidth: true })
      )
    ),
    React.createElement(
      DialogActions,
      null,
      React.createElement(Button, { onClick: onClose }, 'キャンセル'),
      React.createElement(Button, { variant: 'contained', onClick: onClose }, 'サインイン（ダミー）')
    )
  );
}

export function PricingDialog({ open, onClose, onSelect, currentTier }) {
  const plans = [
    { tier: 'Free', price: '¥0', description: '基本機能・単独ユーザー向け' },
    { tier: 'Starter', price: '¥1,980', description: '実験ログとFundingの優先分析' },
    { tier: 'Pro', price: '¥4,980', description: '複数メンバーとAIサポート無制限' }
  ];
  return React.createElement(
    Dialog,
    { open, onClose, maxWidth: 'sm', fullWidth: true },
    React.createElement(DialogTitle, null, 'プランを選択'),
    React.createElement(
      DialogContent,
      null,
      React.createElement(
        Grid,
        { container: true, spacing: 2 },
        plans.map((plan) =>
          React.createElement(
            Grid,
            { item: true, xs: 12, sm: 4, key: plan.tier },
            React.createElement(
              Card,
              { variant: currentTier === plan.tier ? 'outlined' : 'elevation', sx: { height: '100%' } },
              React.createElement(
                CardContent,
                null,
                React.createElement(Typography, { variant: 'h6' }, plan.tier),
                React.createElement(Typography, { variant: 'h4', sx: { my: 1 } }, plan.price),
                React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, plan.description)
              ),
              React.createElement(
                CardActions,
                null,
                React.createElement(
                  Button,
                  { variant: 'contained', fullWidth: true, onClick: () => onSelect(plan.tier), 'aria-label': `${plan.tier}を選択` },
                  `${plan.tier}にする`
                )
              )
            )
          )
        )
      )
    ),
    React.createElement(
      DialogActions,
      null,
      React.createElement(Button, { onClick: onClose }, '閉じる')
    )
  );
}

export function LoanPackModal({ open, onClose, notify }) {
  const [step, setStep] = useState(0);
  const steps = ['事業情報', '財務サマリー', '提出確認'];
  const proceed = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      notify('Loan Packを申し込みました（ダミー）');
      onClose();
      setStep(0);
    }
  };
  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);
  return React.createElement(
    Dialog,
    { open, onClose, maxWidth: 'sm', fullWidth: true },
    React.createElement(DialogTitle, null, 'Loan Pack チェックアウト'),
    React.createElement(
      DialogContent,
      null,
      React.createElement(
        Stepper,
        { activeStep: step, alternativeLabel: true, sx: { mb: 2 } },
        steps.map((label) => React.createElement(Step, { key: label }, React.createElement(StepLabel, null, label)))
      ),
      React.createElement(
        Stack,
        { spacing: 2 },
        step === 0 &&
          React.createElement(
            Fragment,
            null,
            React.createElement(TextField, { label: '事業概要', multiline: true, minRows: 3, fullWidth: true }),
            React.createElement(TextField, { label: '希望資金用途', fullWidth: true })
          ),
        step === 1 &&
          React.createElement(
            Fragment,
            null,
            React.createElement(TextField, { label: '直近売上（月次）', type: 'number', fullWidth: true }),
            React.createElement(TextField, { label: '自己資金', type: 'number', fullWidth: true })
          ),
        step === 2 &&
          React.createElement(
            Fragment,
            null,
            React.createElement(Typography, { variant: 'body2' }, '提出物：事業計画書 / 売上推移 / 許認可写し（チェックリスト）'),
            React.createElement(Checkbox, { defaultChecked: true }),
            '利用規約に同意'
          )
      )
    ),
    React.createElement(
      DialogActions,
      null,
      React.createElement(Button, { onClick: onClose }, '閉じる'),
      React.createElement(Button, { variant: 'contained', onClick: proceed }, step === steps.length - 1 ? '申し込む' : '次へ')
    )
  );
}

export function PermitConciergeModal({ open, onClose, notify }) {
  const [contact, setContact] = useState('');
  useEffect(() => {
    if (!open) setContact('');
  }, [open]);
  return React.createElement(
    Dialog,
    { open, onClose, maxWidth: 'sm', fullWidth: true },
    React.createElement(DialogTitle, null, 'Permit Concierge 相談'),
    React.createElement(
      DialogContent,
      null,
      React.createElement(
        Stack,
        { spacing: 2 },
        React.createElement(Typography, { variant: 'body2' }, '業種や課題を記入すると専門家が折り返します。'),
        React.createElement(TextField, { label: '業種・課題', multiline: true, minRows: 3, value: contact, onChange: (event) => setContact(event.target.value) })
      )
    ),
    React.createElement(
      DialogActions,
      null,
      React.createElement(Button, { onClick: onClose }, '閉じる'),
      React.createElement(Button, {
        variant: 'contained',
        onClick: () => {
          notify('Permit Conciergeに依頼しました（ダミー）');
          onClose();
        }
      }, '送信')
    )
  );
}
