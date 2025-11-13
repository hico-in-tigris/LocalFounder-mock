import { React, MaterialUI } from '../shared/react.js';
import mockAI from '../lib/mock-ai.js';

const { useState, useEffect, useRef, Fragment } = React;
const {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  List,
  ListItem,
  Divider,
  LinearProgress,
  TextField,
  Button,
  Snackbar,
  Alert
} = MaterialUI;

export default function AIChatCard({ messages, setMessages }) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '' });
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMessage = { id: `you-${Date.now()}`, role: 'you', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);
    const delay = 500 + Math.floor(Math.random() * 600);
    setTimeout(() => {
      const aiMessage = { id: `ai-${Date.now()}`, role: 'ai', text: mockAI.reply(trimmed) };
      setMessages((prev) => [...prev, aiMessage]);
      setSending(false);
      setSnack({ open: true, message: 'AIが回答しました' });
    }, delay);
  };

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack({ open: false, message: '' });
  };

  return React.createElement(
    Card,
    { sx: { height: '100%' } },
    React.createElement(CardHeader, {
      title: 'AIアシスタント',
      subheader: '企画・許認可・資金調達の相談に答えます(擬似)'
    }),
    React.createElement(
      CardContent,
      null,
      React.createElement(
        Box,
        { ref: listRef, sx: { maxHeight: 320, overflow: 'auto' } },
        React.createElement(
          List,
          { disablePadding: true },
          messages.map((msg, idx) =>
            React.createElement(
              Fragment,
              { key: msg.id },
              React.createElement(
                ListItem,
                {
                  sx: {
                    justifyContent: msg.role === 'you' ? 'flex-end' : 'flex-start'
                  }
                },
                React.createElement(
                  Box,
                  {
                    sx: {
                      px: 2,
                      py: 1.5,
                      maxWidth: '85%',
                      borderRadius: 2,
                      boxShadow: 0,
                      bgcolor: msg.role === 'you' ? 'primary.light' : 'background.paper',
                      color: msg.role === 'you' ? 'primary.contrastText' : 'text.primary',
                      textAlign: msg.role === 'you' ? 'right' : 'left'
                    }
                  },
                  msg.text
                )
              ),
              idx < messages.length - 1
                ? React.createElement(Divider, { component: 'li', sx: { my: 0.5 } })
                : null
            )
          )
        )
      ),
      sending
        ? React.createElement(Box, { sx: { mt: 2 } }, React.createElement(LinearProgress, { color: 'secondary' }))
        : null
    ),
    React.createElement(
      CardActions,
      {
        sx: {
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 1,
          p: 2
        }
      },
      React.createElement(TextField, {
        label: 'メッセージを入力',
        value: input,
        onChange: (event) => setInput(event.target.value),
        fullWidth: true,
        multiline: true,
        minRows: 2
      }),
      React.createElement(
        Button,
        {
          variant: 'contained',
          onClick: handleSend,
          disabled: sending || !input.trim(),
          sx: { minWidth: 120 }
        },
        sending ? '送信中…' : '送信'
      )
    ),
    React.createElement(
      Snackbar,
      {
        open: snack.open,
        autoHideDuration: 4000,
        onClose: handleSnackClose,
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' }
      },
      React.createElement(
        Alert,
        { severity: 'success', sx: { width: '100%' }, onClose: handleSnackClose },
        snack.message
      )
    )
  );
}
