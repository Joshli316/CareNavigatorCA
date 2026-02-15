'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Phone } from 'lucide-react';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  delay: number; // ms after previous message
}

const CONVERSATION: Message[] = [
  { id: 1, from: 'bot', text: 'Hi! I\'m CareNavigator. I can help you find benefits you may qualify for. It takes about 2 minutes. Ready to start? Reply YES', delay: 0 },
  { id: 2, from: 'user', text: 'YES', delay: 1500 },
  { id: 3, from: 'bot', text: 'Great! First, what state do you live in?', delay: 800 },
  { id: 4, from: 'user', text: 'Texas', delay: 2000 },
  { id: 5, from: 'bot', text: 'Got it — Texas. What county? (e.g., Dallas, Tarrant, Harris)', delay: 800 },
  { id: 6, from: 'user', text: 'Dallas', delay: 1500 },
  { id: 7, from: 'bot', text: 'How old are you?', delay: 600 },
  { id: 8, from: 'user', text: '35', delay: 1200 },
  { id: 9, from: 'bot', text: 'How many people live in your household (including yourself)?', delay: 700 },
  { id: 10, from: 'user', text: '3', delay: 1000 },
  { id: 11, from: 'bot', text: 'Do you or anyone in your household have a disability?\n\n1️⃣ Yes\n2️⃣ No', delay: 800 },
  { id: 12, from: 'user', text: '1', delay: 1500 },
  { id: 13, from: 'bot', text: 'What is your approximate monthly household income (before taxes)? Just the number is fine.', delay: 800 },
  { id: 14, from: 'user', text: '1500', delay: 2000 },
  { id: 15, from: 'bot', text: 'Do you have children under 18?\n\n1️⃣ Yes\n2️⃣ No', delay: 700 },
  { id: 16, from: 'user', text: '1', delay: 1000 },
  { id: 17, from: 'bot', text: '⏳ Checking programs for you...', delay: 500 },
  { id: 18, from: 'bot', text: '✅ Great news! Based on your info, you may qualify for 15 programs worth up to $7,437/month.\n\nTop 3 matches:\n\n🏥 Medicaid — Free healthcare\n🍎 SNAP — $740/mo food benefits\n💰 SSDI — $1,537/mo disability\n\nWant more details? Reply:\n\nA — See all 15 programs\nB — Get help applying\nC — Talk to a person', delay: 2000 },
  { id: 19, from: 'user', text: 'B', delay: 2500 },
  { id: 20, from: 'bot', text: 'I recommend starting with these 3 (fastest approval):\n\n1. WIC — Apply at your local clinic, approved in ~2 weeks\n2. Medicaid — Apply at YourTexasBenefits.com or call 2-1-1\n3. SNAP — Apply same place as Medicaid\n\n📋 I can send you a pre-filled application link. Want me to text it?\n\n1️⃣ Yes, send the link\n2️⃣ I\'d rather talk to someone\n3️⃣ Send me everything by email', delay: 1500 },
  { id: 21, from: 'user', text: '1', delay: 2000 },
  { id: 22, from: 'bot', text: '📎 Here\'s your personalized link:\n\ncarenavigator.org/apply/m4x7k2\n\nYour info is pre-filled — just review and submit. The link expires in 7 days.\n\nNeed help? Call 2-1-1 anytime (free).\n\nReply STOP to unsubscribe.', delay: 1000 },
];

export default function SMSPage() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const startDemo = () => {
    setVisibleMessages([]);
    setMessageIndex(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || messageIndex >= CONVERSATION.length) {
      if (messageIndex >= CONVERSATION.length) setIsPlaying(false);
      return;
    }

    const msg = CONVERSATION[messageIndex];
    const delay = msg.delay + (msg.from === 'bot' ? 800 + msg.text.length * 15 : 300);

    if (msg.from === 'bot') {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages(prev => [...prev, msg]);
        setMessageIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(typingTimer);
    } else {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, msg]);
        setMessageIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, messageIndex]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/demo" className="text-xs font-mono text-gray-300 hover:text-gray-500 transition-colors">&larr; demo</a>
          <h1 className="text-3xl font-bold text-gray-950 tracking-tight mt-6 mb-2">SMS Screening Bot</h1>
          <p className="text-sm text-gray-400">Benefits screening via text. No app, no internet, no smartphone required.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="w-[375px] bg-black rounded-[3rem] p-3 shadow-2xl">
              <div className="bg-white rounded-[2.4rem] overflow-hidden h-[750px] flex flex-col">
                {/* Status bar */}
                <div className="bg-gray-100 px-6 pt-3 pb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold">9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2.5 border border-gray-500 rounded-sm relative"><div className="absolute inset-0.5 bg-gray-500 rounded-sm" style={{ width: '70%' }} /></div>
                  </div>
                </div>

                {/* Chat header */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-accent-600 flex items-center justify-center text-white text-sm font-bold">CN</div>
                  <div>
                    <p className="text-sm font-semibold">211-CARE</p>
                    <p className="text-xs text-green-600">CareNavigator</p>
                  </div>
                  <div className="ml-auto">
                    <Phone className="w-5 h-5 text-accent-600" />
                  </div>
                </div>

                {/* Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-white">
                  {visibleMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm whitespace-pre-line ${
                        msg.from === 'user'
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Text Message"
                    className="flex-1 px-4 py-2 bg-white rounded-full text-sm border border-gray-200"
                    disabled
                  />
                  <button className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Watch the Demo</h2>
              <p className="text-sm text-gray-600 mb-4">See a complete benefits screening happen via text message in under 2 minutes.</p>
              <button
                onClick={startDemo}
                disabled={isPlaying}
                className="w-full px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-colors disabled:opacity-50"
              >
                {isPlaying ? 'Playing...' : visibleMessages.length > 0 ? 'Restart Demo' : 'Play Demo'}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Why SMS?</h2>
              <div className="space-y-4">
                {[
                  { stat: '97%', desc: 'of Americans own a cellphone (including basic phones)' },
                  { stat: '98%', desc: 'SMS open rate vs. 20% for email' },
                  { stat: '40%', desc: 'of target users lack reliable smartphone/internet access' },
                  { stat: '90sec', desc: 'average completion time for SMS screening' },
                ].map(s => (
                  <div key={s.stat} className="flex items-start gap-3">
                    <span className="text-2xl font-bold text-accent-600 tabular-nums w-16 flex-shrink-0">{s.stat}</span>
                    <span className="text-sm text-gray-600 pt-1">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h2>
              <ol className="space-y-3">
                {[
                  'User texts BENEFITS to 211-CARE (or any configured number)',
                  'Bot asks 7 questions via text (~90 seconds)',
                  'Eligibility engine runs server-side in real-time',
                  'Results sent back as text with personalized link',
                  'Link opens pre-filled application on any browser',
                  'Follow-up reminders sent for renewals & deadlines',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 text-accent-700 text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
