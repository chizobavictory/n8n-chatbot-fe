import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, FileIcon, X, FileText, Share2, Github } from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';
import { ImageUploader } from './ImageUploader';
import { ThemeToggle } from './ThemeToggle';
import { RequirementsPanel } from './RequirementsPanel';
import { sendMessage, generateSessionId, getHistory } from '../lib/api';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image' | 'audio';
  imageDataUrl?: string;
  timestamp: Date;
};

const parseStoredContent = (raw: string): { content: string; type: 'text' | 'image' | 'audio'; imageDataUrl?: string } => {
  if (!raw) {
    return { content: '', type: 'text' };
  }
  const trimmed = raw.trim();
  if (!trimmed.startsWith('{')) {
    return { content: raw, type: 'text' };
  }
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      if (parsed.type === 'image') {
        const imageDataUrl = typeof parsed.imageDataUrl === 'string' ? parsed.imageDataUrl : undefined;
        const text = typeof parsed.text === 'string' ? parsed.text : '';
        return {
          content: text || (!imageDataUrl ? 'Image unavailable' : ''),
          type: 'image',
          imageDataUrl,
        };
      }
      if (parsed.type === 'audio') {
        const text = typeof parsed.text === 'string' ? parsed.text : '';
        return { content: text || 'Audio message', type: 'audio' };
      }
      if (typeof parsed.text === 'string') {
        return { content: parsed.text, type: 'text' };
      }
    }
  } catch (error) {
    return { content: raw, type: 'text' };
  }
  return { content: raw, type: 'text' };
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ file: Blob | File; type: 'image' | 'audio' } | null>(null);
  const [showRequirements, setShowRequirements] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const shouldAutoScroll = useRef(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkIfNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 150; // pixels from bottom
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom < threshold;
  };

  const fetchHistory = async () => {
    const history = await getHistory();
    if (history && history.length > 0) {
      setMessages(
        history.map((msg, index) => ({
          ...parseStoredContent(msg.content),
          id: msg.id || index.toString(),
          role: msg.role,
          timestamp: new Date(msg.created_at || Date.now()),
        }))
      );
    }
  };

  useEffect(() => {
    generateSessionId();
    fetchHistory();
    pollingInterval.current = setInterval(fetchHistory, 2000);

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  useEffect(() => {
    // Only auto-scroll if user is near the bottom or if we should force scroll
    if (shouldAutoScroll.current || checkIfNearBottom()) {
      scrollToBottom();
      shouldAutoScroll.current = false;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !attachment) return;

    const currentInput = inputValue;
    const currentAttachment = attachment;

    setInputValue('');
    setAttachment(null);
    setIsLoading(true);
    shouldAutoScroll.current = true; // Force scroll on send

    try {
      await sendMessage(currentInput, currentAttachment?.file || null, currentAttachment?.type || null);
      setTimeout(fetchHistory, 500);
    } catch (error) {
      console.error('Failed to send', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAgentThinking = messages.length > 0 && messages[messages.length - 1].role === 'user';

  return (
    <div className='relative min-h-screen w-full bg-background'>
      {/* Gradient Mesh Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px] animate-pulse' />
        <div
          className='absolute -bottom-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-accent/20 blur-[120px] animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div className='absolute top-[20%] left-[30%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]' />
      </div>

      <header className='relative z-10 flex items-center justify-between px-8 py-6 border-b border-border/30 backdrop-blur-sm bg-background/50'>
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold tracking-tight'>n8n GenAI Chatbot</h1>
          <Button
            variant='outline'
            size='icon'
            onClick={() => window.open('https://github.com/chizobavictory/n8n-chatbot-be', '_blank')}
            className='rounded-full border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all h-9 w-9'
            title='View GitHub Repository'
          >
            <Github className='h-5 w-5' />
          </Button>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => setShowRequirements(!showRequirements)}
            className={`rounded-full border-2 border-primary transition-all ${
              showRequirements ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-primary hover:text-primary-foreground'
            }`}
            title='View Requirements'
          >
            <FileText className='h-5 w-5' />
          </Button>
          <div className='h-6 w-px bg-border/50' />
          <Button
            variant='outline'
            size='icon'
            onClick={() => window.open('https://drive.google.com/file/d/1dhq5r-TilNdIpUaXQp-grO3u11-6IolD/view?usp=sharing', '_blank')}
            className='rounded-full border-2 border-primary bg-transparent hover:bg-primary hover:text-primary-foreground transition-all'
            title='View Architectural Diagram'
          >
            <Share2 className='h-5 w-5' />
          </Button>
          <div className='h-6 w-px bg-border/50' />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Chat Area */}
      <div className='relative z-10 flex h-[calc(100vh-5rem)]'>
        {/* Chat Main */}
        <main className={`flex flex-col flex-1 transition-all duration-300 ${showRequirements ? 'mr-96' : 'mr-0'}`}>
          {/* Messages Container */}
          <div ref={messagesContainerRef} className='flex-1 overflow-y-auto overflow-x-hidden py-8 px-8 max-w-5xl mx-auto w-full space-y-4'>
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-center h-full text-center space-y-4'>
                <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm'>
                  <Send className='h-8 w-8 text-primary' />
                </div>
                <div className='space-y-2'>
                  <p className='text-lg font-medium text-foreground'>Start a conversation with the AI</p>
                  <p className='text-sm text-muted-foreground'>Send a message, upload an image, or record audio</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-3 backdrop-blur-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-card/80 border border-border/50 shadow-sm'
                  }`}
                >
                  {message.content && <p className='text-sm whitespace-pre-wrap leading-relaxed'>{message.content}</p>}
                  {message.type === 'image' && message.imageDataUrl && (
                    <img
                      src={message.imageDataUrl}
                      alt={message.content || 'Uploaded image'}
                      className='mt-2 max-h-64 w-full rounded-2xl object-contain border border-border/30'
                    />
                  )}
                  {message.type === 'audio' && <span className='text-xs italic opacity-70'>(Audio)</span>}
                  {message.type === 'image' && !message.imageDataUrl && <span className='text-xs italic opacity-70'>(Image)</span>}
                  <span className='text-[10px] opacity-50 block mt-1.5'>{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}

            {isAgentThinking && (
              <div className='flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300'>
                <div className='bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl px-5 py-3 shadow-sm'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-1'>
                      <span className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                      <span className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                      <span className='w-2 h-2 bg-primary rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className='text-sm text-muted-foreground'>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className='py-6 px-8 space-y-3 border-t border-border/30 backdrop-blur-sm bg-background/50 max-w-5xl mx-auto w-full'>
            {attachment && (
              <div className='flex items-center gap-2 bg-card/60 backdrop-blur-sm border border-border/50 p-3 rounded-2xl w-fit'>
                <FileIcon className='h-4 w-4 text-primary' />
                <span className='text-xs font-medium'>{attachment.type} attached</span>
                <Button variant='ghost' size='icon' className='h-6 w-6 rounded-full' onClick={() => setAttachment(null)}>
                  <X className='h-3 w-3' />
                </Button>
              </div>
            )}

            <div className='flex gap-3'>
              <ImageUploader onImageSelected={(file) => setAttachment({ file, type: 'image' })} disabled={isLoading || !!attachment} />
              <AudioRecorder onAudioRecorded={(blob) => setAttachment({ file: blob, type: 'audio' })} disabled={isLoading || !!attachment} />
              <Input
                placeholder='Type your message...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className='flex-1 bg-card/60 backdrop-blur-sm border-border/50 focus-visible:ring-primary rounded-2xl h-12'
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue && !attachment}
                className='h-12 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30'
              >
                <Send className='h-4 w-4 mr-2' />
                Send
              </Button>
            </div>
          </div>
        </main>

        {/* Requirements Panel */}
        <aside
          className={`absolute top-0 right-0 h-full w-96 bg-background border-l border-border/30 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
            showRequirements ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <RequirementsPanel />
        </aside>
      </div>
    </div>
  );
}
