import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAspectWebView, BridgeResultEvent } from '@aspect/react-native-web';

interface LogEntry {
  time: string;
  message: string;
  direction: 'in' | 'out';
}

export default function App() {
  // Use the widget URL - adjust based on your setup
  const widgetUrl = Platform.select({
    web: 'http://localhost:3001/index.html',
    default: 'http://10.0.2.2:3001/index.html', // Android emulator
    // For iOS simulator, use your machine's IP address
  });

  const [bridge, loaded, WebView] = useAspectWebView({
    url: widgetUrl!,
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const addLog = useCallback((message: string, direction: 'in' | 'out') => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, message, direction }, ...prev].slice(0, 30));
  }, []);

  useEffect(() => {
    if (loaded) {
      addLog('Bridge connected!', 'in');

      // Initialize with handlers
      bridge.init({
        parentGreet: async (params: { from: string }) => {
          addLog(`Greeting from: ${params.from}`, 'in');
          return { message: `Hello from ${Platform.OS}!` };
        },
        getUserData: async () => {
          addLog('User data requested', 'in');
          return {
            id: 123,
            name: 'John Doe',
            platform: Platform.OS,
          };
        },
        showNotification: async (params: { title: string; message: string }) => {
          addLog(`Notification: ${params.title}`, 'in');
          // In a real app, use a proper notification library
          return { shown: true };
        },
      });

      // Subscribe to events
      const handleEvent = (result: BridgeResultEvent) => {
        if (result.method) {
          addLog(`Event: ${result.method}`, 'in');
        }
      };
      bridge.subscribe(handleEvent);

      return () => bridge.unsubscribe(handleEvent);
    }
  }, [loaded, bridge, addLog]);

  const handleGreet = async () => {
    try {
      addLog('Sending greeting...', 'out');
      const result = await bridge.send<{ message: string }>('greet', {
        name: Platform.OS,
      });
      addLog(`Response: ${result.message}`, 'in');
    } catch (error: unknown) {
      const err = error as { error_message?: string };
      addLog(`Error: ${err.error_message || 'Unknown'}`, 'in');
    }
  };

  const handleToggleTheme = async () => {
    try {
      const newDark = !darkMode;
      setDarkMode(newDark);
      addLog(`Setting theme: ${newDark ? 'dark' : 'light'}`, 'out');
      await bridge.send('setTheme', { dark: newDark });
    } catch (error: unknown) {
      const err = error as { error_message?: string };
      addLog(`Error: ${err.error_message || 'Unknown'}`, 'in');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>Aspect Example</Text>
        <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
      </View>

      <View style={styles.webviewContainer}>
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, loaded && styles.statusDotConnected]} />
          <Text style={styles.statusText}>
            {loaded ? 'Connected' : 'Connecting...'}
          </Text>
        </View>
        <WebView style={styles.webview} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, !loaded && styles.buttonDisabled]}
          onPress={handleGreet}
          disabled={!loaded}
        >
          <Text style={styles.buttonText}>Greet Widget</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !loaded && styles.buttonDisabled]}
          onPress={handleToggleTheme}
          disabled={!loaded}
        >
          <Text style={styles.buttonText}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Event Log</Text>
        <ScrollView style={styles.log}>
          {logs.map((log, i) => (
            <View key={i} style={styles.logEntry}>
              <Text style={styles.logTime}>{log.time}</Text>
              <View
                style={[
                  styles.logDirection,
                  log.direction === 'in' ? styles.logIn : styles.logOut,
                ]}
              >
                <Text style={styles.logDirectionText}>
                  {log.direction === 'in' ? '← IN' : '→ OUT'}
                </Text>
              </View>
              <Text style={styles.logMessage}>{log.message}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#667eea',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  webviewContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#dc3545',
    marginRight: 8,
  },
  statusDotConnected: {
    backgroundColor: '#28a745',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  webview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  logContainer: {
    height: 200,
    margin: 16,
    marginTop: 0,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
  },
  logTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  log: {
    flex: 1,
  },
  logEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  logTime: {
    color: '#888',
    fontSize: 11,
    marginRight: 8,
  },
  logDirection: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  logIn: {
    backgroundColor: '#28a745',
  },
  logOut: {
    backgroundColor: '#007bff',
  },
  logDirectionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  logMessage: {
    color: '#e0e0e0',
    fontSize: 13,
    flex: 1,
  },
});
