import { React, MaterialUI } from '../shared/react.js';

const { Box } = MaterialUI;

export default function TabPanel({ children, value, index }) {
  return React.createElement(
    Box,
    {
      role: 'tabpanel',
      hidden: value !== index,
      id: `info-tabpanel-${index}`,
      'aria-labelledby': `info-tab-${index}`
    },
    value === index ? React.createElement(Box, { sx: { p: 3 } }, children) : null
  );
}
