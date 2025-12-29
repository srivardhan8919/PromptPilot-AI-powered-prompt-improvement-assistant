import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import { llmService, authService } from '../services/api';
import './Home.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can log the error to a monitoring service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Something went wrong. Please reload the page.</div>;
    }
    return this.props.children;
  }
}

function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const chatWindowRef = useRef(null);
  const STORAGE_KEY = 'promptpilot_chat_messages';

  // Load messages from sessionStorage on component mount
  useEffect(() => {
    try {
      const savedMessages = sessionStorage.getItem(STORAGE_KEY);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading messages from sessionStorage:', error);
    }
  }, []);

  // Save messages to sessionStorage whenever messages change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        // Clear storage if messages array is empty
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving messages to sessionStorage:', error);
    }
  }, [messages]);

  // Check if user is authenticated on component mount
  useEffect(() => {
    if (!authService.isAuthenticated()) { 
      navigate('/login');
    }
  }, [navigate]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Detect intent from user's previous prompt (not AI response)
  const detectIntent = (userPrompt) => {
    if (!userPrompt) return null;
    const text = userPrompt.toLowerCase();
    
    // Image generation keywords
    const imageKeywords = ['image', 'photo', 'picture', 'generate', 'create', 'draw', 'paint', 
                          'visual', 'illustration', 'artwork', 'graphic', 'render', 'car', 'bike',
                          'sunset', 'portrait', 'landscape', 'design'];
    if (imageKeywords.some(keyword => text.includes(keyword))) {
      return 'image_generation';
    }
    
    // Coding keywords
    const codingKeywords = ['code', 'function', 'program', 'script', 'algorithm', 'api', 
                           'class', 'method', 'variable', 'debug', 'implement', 'build',
                           'create a', 'write a', 'make a'];
    if (codingKeywords.some(keyword => text.includes(keyword))) {
      return 'coding';
    }
    
    // Video generation keywords
    const videoKeywords = ['video', 'animation', 'movie', 'film', 'clip', 'footage'];
    if (videoKeywords.some(keyword => text.includes(keyword))) {
      return 'video_generation';
    }
    
    // Music keywords
    const musicKeywords = ['music', 'song', 'melody', 'beat', 'audio', 'sound', 'tune'];
    if (musicKeywords.some(keyword => text.includes(keyword))) {
      return 'music';
    }
    
    // Writing keywords
    const writingKeywords = ['poem', 'story', 'essay', 'article', 'blog', 'write', 'compose'];
    if (writingKeywords.some(keyword => text.includes(keyword))) {
      return 'writing';
    }
    
    // Q&A keywords
    const qaKeywords = ['explain', 'what is', 'how to', 'why', 'question', 'answer', 'help'];
    if (qaKeywords.some(keyword => text.includes(keyword))) {
      return 'qa';
    }
    
    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const promptText = input.trim();
    const userMessage = { id: Date.now(), role: 'user', text: promptText };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let previousIntent = null;
      // Find the previous USER message (before the current one) to determine context
      // This helps when user says "thank you" - we know what they were thanking for
      // Note: messages state hasn't updated yet (React state is async), so we get previous messages
      const previousUserMessages = messages.filter(m => m.role === 'user');
      if (previousUserMessages.length > 0) {
        const previousUserPrompt = previousUserMessages[previousUserMessages.length - 1].text;
        previousIntent = detectIntent(previousUserPrompt);
      }
      
      console.log("Sending prompt to improve:", promptText, "Previous intent:", previousIntent);
      const response = await llmService.improvePrompt(promptText, previousIntent);
      const improvedPrompt = response.improved_prompt;

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: improvedPrompt }
      ]);
    } catch (error) {
      console.error('Error improving prompt:', error);
      let errorMessage = "Sorry, I couldn't improve your prompt. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = "Your prompt is too short. Please provide a prompt with at least 10 characters.";
      }
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', text: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (index, newText) => {
    const updatedMessages = [...messages];
    updatedMessages[index].text = newText;

    // If an AI response follows the edited message, remove it to generate a new one
    if (updatedMessages[index + 1]?.role === 'ai') {
      updatedMessages.splice(index + 1, 1);
    }

    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await llmService.improvePrompt(newText);
      const improvedPrompt = response.improved_prompt;
      
      // Add the new AI response
      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'ai', text: improvedPrompt }
      ]);
    } catch (error) {
      console.error('Error improving edited prompt:', error);
      const fallback = {
        id: Date.now(),
        role: 'ai',
        text: "Something went wrong while improving the edited prompt."
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="home-wrapper">
        <Sidebar />
        <main className="chat-area">
          <Header />
          <div className="chat-window" ref={chatWindowRef}>
            {messages.length === 0 ? (
              <div className="empty-state">
                <h3>Welcome to PromptPilot!</h3>
                <p>Enter a prompt below and I'll help you improve it.</p>
                <p className="hint">Try something like: "Create an image of a sunset over the ocean"</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id} // Use unique ID for key
                  role={msg.role}
                  text={msg.text}
                  onEditSave={
                    msg.role === 'user'
                      ? (newText) => handleEditSave(idx, newText)
                      : undefined
                  }
                />
              ))
            )}
            {loading && <ChatMessage role="ai" text="Improving your prompt..." loading={true} />}
          </div>
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            disabled={loading}
            placeholder="Enter a prompt to improve... (min. 10 characters)"
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default Home;