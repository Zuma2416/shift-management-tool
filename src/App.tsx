import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import styled from '@emotion/styled';
import ShiftCalendar from './components/ShiftCalendar';
import StaffManagement from './components/StaffManagement';
import TemplateManagement from './components/TemplateManagement';
import NGShiftSettings from './components/NGShiftSettings';
import WeeklyPatternSettings from './components/WeeklyPatternSettings';
import BulkShiftInput from './components/BulkShiftInput';
import ShiftSummary from './components/ShiftSummary';
import Header from './components/Header';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { ShiftProvider } from './contexts/ShiftContext';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Modal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isVisible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  min-width: 400px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

type PanelType = 'staff' | 'template' | 'ngShift' | 'weeklyPattern' | 'bulkInput' | null;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showSummary, setShowSummary] = useState(false);

  const handleReset = () => {
    if (window.confirm('すべてのデータをリセットしてもよろしいですか？')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCloseModal = () => {
    setActivePanel(null);
  };

  const renderModalContent = () => {
    switch (activePanel) {
      case 'staff':
        return <StaffManagement onClose={handleCloseModal} />;
      case 'template':
        return <TemplateManagement onClose={handleCloseModal} />;
      case 'ngShift':
        return <NGShiftSettings onClose={handleCloseModal} />;
      case 'weeklyPattern':
        return <WeeklyPatternSettings onClose={handleCloseModal} />;
      case 'bulkInput':
        return <BulkShiftInput onClose={handleCloseModal} />;
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <ShiftProvider>
          <AppContainer>
            <Title>グループホームシフト表作成ツール</Title>
            <Header
              year={selectedYear}
              month={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
              onStaffManagement={() => setActivePanel('staff')}
              onTemplateManagement={() => setActivePanel('template')}
              onReset={handleReset}
              onPrint={handlePrint}
            />

            <ButtonGroup>
              <Button onClick={() => setActivePanel('ngShift')}>
                NGシフト設定
              </Button>
              <Button onClick={() => setActivePanel('weeklyPattern')}>
                週単位パターン
              </Button>
              <Button onClick={() => setActivePanel('bulkInput')}>
                一括入力
              </Button>
              <Button onClick={() => setShowSummary(!showSummary)}>
                {showSummary ? '集計を隠す' : '勤務集計を表示'}
              </Button>
            </ButtonGroup>

            {showSummary && (
              <ShiftSummary year={selectedYear} month={selectedMonth} />
            )}

            <ShiftCalendar year={selectedYear} month={selectedMonth} />

            <Modal 
              isVisible={activePanel !== null} 
              onClick={handleCloseModal}
            >
              <ModalContent onClick={e => e.stopPropagation()}>
                {renderModalContent()}
              </ModalContent>
            </Modal>
          </AppContainer>
        </ShiftProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App; 