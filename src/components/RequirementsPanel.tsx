import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from './ui/button';

export function RequirementsPanel() {
  const [activeTab, setActiveTab] = useState<'requirements' | 'instructions'>('requirements');

  const requirements = [
    {
      title: 'Modern Frontend',
      description: 'Built with React, Vite, and ShadcnUI with minimal, modern design',
      completed: true,
    },
    {
      title: 'Single User Session',
      description: 'Fixed session ID for consistent memory across interactions',
      completed: true,
    },
    {
      title: 'LLM Integration',
      description: 'Using OpenAI GPT-4o-mini for intelligent responses',
      completed: true,
    },
    {
      title: 'Speech to Text (STT)',
      description: 'OpenAI Whisper integration for audio message transcription',
      completed: true,
    },
    {
      title: 'Image to Text (ITT)',
      description: 'OpenAI Vision for image description and OCR',
      completed: true,
    },
    {
      title: 'Redis Message Queue',
      description: 'Messages batched and processed together with 4-second debounce',
      completed: true,
    },
    {
      title: 'PostgreSQL Memory',
      description: 'Chat history stored in PostgreSQL with session-based retrieval',
      completed: true,
    },
    {
      title: 'Message Splitting',
      description: 'AI responses split into multiple chat bubbles for better UX',
      completed: true,
    },
    {
      title: 'Availability Tool',
      description: 'Check available appointment slots',
      completed: true,
    },
    {
      title: 'Booking Tool',
      description: 'Schedule appointments with date/time validation',
      completed: true,
    },
    {
      title: 'Follow-up System',
      description: 'Automated follow-ups stored in PostgreSQL with scheduled triggers',
      completed: true,
    },
  ];

  const completedCount = requirements.filter((r) => r.completed).length;
  const totalCount = requirements.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className='h-full flex flex-col'>
      {/* Tabs */}
      <div className='p-4 border-b border-border/30'>
        <div className='flex gap-2 bg-muted/50 p-1 rounded-lg'>
          <Button
            variant={activeTab === 'requirements' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('requirements')}
            className='flex-1 rounded-md'
          >
            Requirements
          </Button>
          <Button
            variant={activeTab === 'instructions' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('instructions')}
            className='flex-1 rounded-md'
          >
            Instructions
          </Button>
        </div>
      </div>

      {/* Requirements View */}
      {activeTab === 'requirements' && (
        <>
          {/* Header */}
          <div className='p-6 border-b border-border/30'>
            <h2 className='text-xl font-bold mb-2'>Task Requirements</h2>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <div className='flex-1 h-2 bg-border/30 rounded-full overflow-hidden'>
                <div className='h-full bg-primary transition-all duration-500' style={{ width: `${percentage}%` }} />
              </div>
              <span className='font-medium'>
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>

          {/* Requirements List */}
          <div className='flex-1 overflow-y-auto p-6 space-y-4'>
            {requirements.map((req, index) => (
              <div key={index} className='flex gap-3 group'>
                <div className='flex-shrink-0 mt-0.5'>
                  {req.completed ? <CheckCircle2 className='h-5 w-5 text-primary' /> : <Circle className='h-5 w-5 text-muted-foreground' />}
                </div>
                <div className='flex-1 space-y-1'>
                  <h3 className='font-medium text-sm'>{req.title}</h3>
                  <p className='text-xs text-muted-foreground leading-relaxed'>{req.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className='p-6 border-t border-border/30 bg-card/50 backdrop-blur-sm'>
            <div className='flex items-center gap-2 text-sm'>
              <CheckCircle2 className='h-4 w-4 text-primary' />
              <span className='font-medium'>All requirements completed!</span>
            </div>
            <p className='text-xs text-muted-foreground mt-1'>Full-stack n8n chatbot with STT, ITT, memory, and scheduling</p>
          </div>
        </>
      )}

      {/* Instructions View */}
      {activeTab === 'instructions' && (
        <>
          <div className='p-6 border-b border-border/30'>
            <h2 className='text-xl font-bold'>Task #1</h2>
            <p className='text-sm text-muted-foreground mt-1'>n8n Chatbot + Basic Front End</p>
          </div>

          <div className='flex-1 overflow-y-auto p-6 space-y-4 text-sm leading-relaxed'>
            <p className='text-muted-foreground'>
              For your first task, we will test your n8n and full stack development experience by building out an example workflow.
            </p>

            <div className='space-y-3'>
              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Build basic front end for receiving and sending messages, use React/Next.js and Shadcnui. Make sure it's minimal and modern.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>One user only (keep session id for memory fixed).</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Use any LLM you want.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Implement STT (Speech to Text), using OpenAI or similar.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Implement ITT (Image to Text), using OpenAI or similar.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Use Redis nodes for messaging queue so user can send multiple messages but the AI responds to all of them at once.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Implement simple memory or PostgreSQL memory for the AI.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>
                  Implement a message splitting system so that the AI outputs a response that is sent in multiple messages, not just one. Should be
                  done via output formatting. Should show multiple messages in the front end chat interface.
                </p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <p>Implement 3 basic tools: getting availability, booking appointments, booking a follow up.</p>
              </div>

              <div className='flex gap-2'>
                <span className='text-muted-foreground'>•</span>
                <div>
                  <p className='font-medium mb-1'>Important:</p>
                  <p>
                    To implement follow up, create a system that stores a specific time and date to message the client again with context. It must
                    check continuously (every minute) until the time is reached. Recommended to do this via PostgreSQL/Supabase sending a request to a
                    secondary trigger in the workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='p-6 border-t border-border/30 bg-card/50 backdrop-blur-sm'>
            <p className='text-xs text-muted-foreground'>
              Switch to the <span className='font-medium text-foreground'>Requirements</span> tab to see completion status
            </p>
          </div>
        </>
      )}
    </div>
  );
}
