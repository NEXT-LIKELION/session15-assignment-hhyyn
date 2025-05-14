import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import TodoList from './components/TodoList';
import './App.css';

// 현대적인 테마 생성
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5568FE', // 밝은 파란색
      light: '#818BFE',
      dark: '#3647E0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FE5568', // 산호색
      light: '#FF818B',
      dark: '#E03647',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FA',
      paper: '#ffffff',
    },
    text: {
      primary: '#2A3240',
      secondary: '#5F6B7A',
    },
    error: {
      main: '#FF4757',
    },
    success: {
      main: '#2ED573',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard',
      'Noto Sans KR',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 10px rgba(0, 0, 0, 0.03)',
    '0px 4px 15px rgba(0, 0, 0, 0.05)',
    '0px 6px 20px rgba(0, 0, 0, 0.07)',
    // 더 강한 그림자 효과
    '0px 8px 25px rgba(0, 0, 0, 0.1)',
    '0px 10px 30px rgba(0, 0, 0, 0.12)',
    ...Array(19).fill('none'), // 기본 shadows 배열의 크기를 맞추기 위한 더미 값
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #5568FE 30%, #818BFE 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #FE5568 30%, #FF818B 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0px 4px 15px rgba(85, 104, 254, 0.15)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodoList />
    </ThemeProvider>
  );
}

export default App;
