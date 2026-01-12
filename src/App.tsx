import { ChatInterface } from './components/ChatInterface';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme='system'>
      <ChatInterface />
    </ThemeProvider>
  );
}

export default App;
