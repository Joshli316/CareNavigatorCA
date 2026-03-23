'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useResults } from '@/lib/context/ResultsContext';
import { useQuiz } from '@/lib/context/QuizContext';
import { buildSuggestedQuestions } from '@/lib/ai/system-prompt';
import { trackEvent } from '@/lib/utils/analytics';

function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AdvisorPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results } = useResults();
  const { state: quizState } = useQuiz();

  const suggestedQuestions = results.length > 0 ? buildSuggestedQuestions(results) : [];

  // Check if AI is available on mount
  useEffect(() => {
    if (aiAvailable !== null) return;
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'test' }], quizData: quizState.data, results: [] }),
    }).then(res => {
      setAiAvailable(res.status !== 503);
    }).catch(() => {
      setAiAvailable(false);
    });
  }, [aiAvailable, quizState.data]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);
    trackEvent('advisor_message', { question: text.trim().slice(0, 100) });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          quizData: quizState.data,
          results,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      // Read SSE stream
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      let assistantText = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

        for (const line of lines) {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'text') {
            assistantText += data.content;
            setMessages([...newMessages, { role: 'assistant', content: assistantText }]);
          } else if (data.type === 'error') {
            throw new Error(data.content);
          }
        }
      }

      if (!assistantText) {
        setMessages([...newMessages, { role: 'assistant', content: 'I wasn\'t able to generate a response. Please try again.' }]);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setMessages(newMessages); // Remove loading state
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, quizState.data, results]);

  if (results.length === 0) return null;

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); trackEvent('advisor_open'); }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all hover:scale-105 print:hidden"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI Advisor</span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden print:hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Benefits Advisor</p>
                <p className="text-[11px] text-gray-500">AI-powered guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[300px] max-h-[420px]">
            {messages.length === 0 && !isLoading && (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-700">
                    I can help you understand your results, explain eligibility, and guide you through applications. Ask me anything!
                  </p>
                </div>

                {aiAvailable === false && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-xs text-amber-700">
                      AI advisor requires an API key. Add <code className="bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code> to <code className="bg-amber-100 px-1 rounded">.env.local</code> to enable.
                    </p>
                  </div>
                )}

                {aiAvailable !== false && suggestedQuestions.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Suggested questions</p>
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="w-full text-left text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-800'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="whitespace-pre-wrap [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{
                        __html: escapeHtml(msg.content)
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                    <User className="w-3.5 h-3.5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-gray-600" />
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={aiAvailable === false ? 'AI not configured...' : 'Ask about your benefits...'}
                disabled={isLoading || aiAvailable === false}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 disabled:opacity-50 disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || aiAvailable === false}
                className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
