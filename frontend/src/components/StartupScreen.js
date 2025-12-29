import React, { useEffect, useState, useRef } from 'react';
import './StartupScreen.css';

const description = "Prompt Pilot: Your AI assistant. Loading...";
const MIN_DISPLAY_TIME = 2000; // Minimum time to show startup screen (2 seconds)
const HEALTH_CHECK_TIMEOUT = 10000; // Max time to wait for health check (10 seconds)

function StartupScreen({ onReady, backendUrl }) {
  const [typed, setTyped] = useState('');
  const [checking, setChecking] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [error, setError] = useState('');
  const [canSkip, setCanSkip] = useState(false);
  const startTimeRef = useRef(Date.now());
  const healthCheckTimeoutRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setTyped(description.slice(0, i));
      i++;
      if (i > description.length) {
        clearInterval(typing);
        setChecking(true);
      }
    }, 50);
    return () => clearInterval(typing);
  }, []);

  // Proceed to app after minimum display time
  const proceedToApp = React.useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);
    
    setTimeout(() => {
      onReady();
    }, remaining);
  }, [onReady]);

  // Backend health check - non-blocking with timeout
  useEffect(() => {
    if (checking && backendUrl) {
      let healthCheckCompleted = false;
      let retryCount = 0;
      const MAX_RETRIES = 3;
      
      const checkBackend = () => {
        // Use AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, 5000); // 5 second timeout per request

        const healthUrl = `${backendUrl}/api/health`;
        console.log('Checking backend health at:', healthUrl);
        
        fetch(healthUrl, { 
          signal: controller.signal,
          method: 'GET',
          cache: 'no-cache',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          }
        })
          .then(res => {
            clearTimeout(timeoutId);
            console.log('Health check response status:', res.status);
            if (res.ok) {
              healthCheckCompleted = true;
              setBackendReady(true);
              setError('');
              console.log('Backend is ready!');
              proceedToApp();
            } else {
              if (!healthCheckCompleted && retryCount < MAX_RETRIES) {
                retryCount++;
                setError(`Backend not ready (${res.status}). Retrying... (${retryCount}/${MAX_RETRIES})`);
                retryTimeoutRef.current = setTimeout(checkBackend, 2000);
              } else if (!healthCheckCompleted) {
                setError('Backend health check failed. You can skip or check backend URL.');
                setCanSkip(true);
              }
            }
          })
          .catch((err) => {
            clearTimeout(timeoutId);
            console.error('Health check error:', err);
            if (err.name === 'AbortError') {
              if (!healthCheckCompleted && retryCount < MAX_RETRIES) {
                retryCount++;
                setError(`Request timeout. Retrying... (${retryCount}/${MAX_RETRIES})`);
                retryTimeoutRef.current = setTimeout(checkBackend, 2000);
              } else if (!healthCheckCompleted) {
                setError('Backend connection timeout. Check if backend is running.');
                setCanSkip(true);
              }
            } else if (!healthCheckCompleted && retryCount < MAX_RETRIES) {
              retryCount++;
              const errorMsg = err.message || 'Connection error';
              setError(`${errorMsg}. Retrying... (${retryCount}/${MAX_RETRIES})`);
              retryTimeoutRef.current = setTimeout(checkBackend, 2000);
            } else if (!healthCheckCompleted) {
              setError(`Cannot connect to backend at ${backendUrl}. Check if it's running.`);
              setCanSkip(true);
            }
          });
      };

      // Start health check
      checkBackend();

      // Set overall timeout - don't auto-proceed on error, let user decide
      healthCheckTimeoutRef.current = setTimeout(() => {
        if (!healthCheckCompleted) {
          console.warn('Health check timeout reached');
          setError('Backend connection taking longer than expected. You can skip to continue or wait...');
          setCanSkip(true);
          // Don't auto-proceed - let user manually skip if needed
        }
      }, HEALTH_CHECK_TIMEOUT);

      return () => {
        if (healthCheckTimeoutRef.current) {
          clearTimeout(healthCheckTimeoutRef.current);
        }
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      };
    } else if (checking && !backendUrl) {
      // No backend URL configured, proceed immediately
      setError('No backend URL configured. Using default...');
      setTimeout(proceedToApp, 1000);
    }
  }, [checking, backendUrl, proceedToApp]);

  // Allow manual skip after minimum time
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSkip(true);
    }, MIN_DISPLAY_TIME);
    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    if (canSkip) {
      onReady();
    }
  };

  return (
    <div className="startup-screen">
      <div className="logo-animation">Prompt Pilot</div>
      <div className="typing-desc">{typed}</div>
      {checking && (
        <div className="backend-status">
          {error || 'Checking backend...'}
        </div>
      )}
      {canSkip && !backendReady && (
        <button 
          className="skip-button" 
          onClick={handleSkip}
          aria-label="Skip startup screen"
        >
          Skip
        </button>
      )}
    </div>
  );
}

export default StartupScreen;
