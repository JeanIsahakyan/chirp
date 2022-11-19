import * as React from 'react';
import { Bridge } from './Bridge';
import { Webview } from './Webview';
import { Platform } from 'react-native';

export default function App() {
  // @ts-ignore
  if (Platform.OS === 'web' && window?.location?.pathname === '/bridge') {
    return <Bridge />;
  }
  return <Webview />;
}
