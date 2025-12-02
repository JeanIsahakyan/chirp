import React, { useEffect, useState, useCallback } from 'react';
import { useAspectIframe, BridgeResultEvent } from '@aspect/web';

interface LogEntry {
  time: string;
  message: string;
  direction: 'incoming' | 'outgoing';
}

function App() {
  const [bridge, loaded, Iframe] = useAspectIframe({
    url: 'http://localhost:3001/index.html',
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const addLog = useCallback((message: string, direction: 'incoming' | 'outgoing') => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, message, direction }, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (loaded) {
      addLog('Bridge connected!', 'incoming');

      // Initialize with handlers for messages from the widget
      bridge.init({
        parentGreet: async (params: { from: string }) => {
          addLog(`Received greeting from: ${params.from}`, 'incoming');
          return { message: `Hello, ${params.from}! Greetings from parent.` };
        },
        getUserData: async () => {
          addLog('Widget requested user data', 'incoming');
          return {
            id: 123,
            name: 'John Doe',
            email: 'john@example.com',
          };
        },
        showNotification: async (params: { title: string; message: string }) => {
          addLog(`Notification: ${params.title} - ${params.message}`, 'incoming');
          alert(`${params.title}\n\n${params.message}`);
          return { shown: true };
        },
      });

      // Subscribe to all events for logging
      const handleEvent = (result: BridgeResultEvent) => {
        if (result.method) {
          addLog(`Event: ${result.method}`, 'incoming');
        }
      };
      bridge.subscribe(handleEvent);

      return () => bridge.unsubscribe(handleEvent);
    }
  }, [loaded, bridge, addLog]);

  const handleGreetWidget = async () => {
    try {
      addLog('Sending greeting to widget...', 'outgoing');
      const result = await bridge.send<{ message: string }>('greet', { name: 'Parent App' });
      addLog(`Response: ${result.message}`, 'incoming');
    } catch (error: unknown) {
      const err = error as { error_message?: string };
      addLog(`Error: ${err.error_message || 'Unknown error'}`, 'incoming');
    }
  };

  const handleUpdateData = async () => {
    try {
      addLog('Sending data update to widget...', 'outgoing');
      const result = await bridge.send('updateData', {
        timestamp: Date.now(),
        value: Math.random().toFixed(2),
      });
      addLog(`Update result: ${JSON.stringify(result)}`, 'incoming');
    } catch (error: unknown) {
      const err = error as { error_message?: string };
      addLog(`Error: ${err.error_message || 'Unknown error'}`, 'incoming');
    }
  };

  const handleToggleTheme = async () => {
    try {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      addLog(`Setting widget theme to ${newDarkMode ? 'dark' : 'light'}...`, 'outgoing');
      const result = await bridge.send('setTheme', { dark: newDarkMode });
      addLog(`Theme result: ${JSON.stringify(result)}`, 'incoming');
    } catch (error: unknown) {
      const err = error as { error_message?: string };
      addLog(`Error: ${err.error_message || 'Unknown error'}`, 'incoming');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>@aspect/web Example</h1>
        <p>Parent application embedding an iframe widget</p>
      </header>

      <main className="main">
        <div className="panel">
          <h2>Embedded Widget</h2>
          <div className="status">
            <div className={`status-dot ${loaded ? 'connected' : ''}`} />
            <span>{loaded ? 'Connected' : 'Connecting...'}</span>
          </div>
          <div className="iframe-container">
            <Iframe style={{ width: '100%', height: '400px' }} />
          </div>
        </div>

        <div className="panel">
          <h2>Controls</h2>
          <div className="controls">
            <button onClick={handleGreetWidget} disabled={!loaded}>
              Greet Widget
            </button>
            <button onClick={handleUpdateData} disabled={!loaded}>
              Send Data Update
            </button>
            <button onClick={handleToggleTheme} disabled={!loaded}>
              Toggle Theme
            </button>
          </div>

          <h2>Event Log</h2>
          <div className="log">
            {logs.length === 0 ? (
              <div className="log-entry">
                <span className="log-time">--:--:--</span>
                <span> Waiting for events...</span>
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="log-entry">
                  <span className="log-time">{log.time}</span>
                  <span className={`log-direction ${log.direction}`}>
                    {log.direction === 'incoming' ? '← IN' : '→ OUT'}
                  </span>
                  <div>{log.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
