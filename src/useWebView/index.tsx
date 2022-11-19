import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WebView } from 'react-native-webview';
import { BridgeCore } from '../Bridge/BridgeCore';
import { BridgeInternal } from '../Bridge/BridgeInternal';
import { BridgeBase } from '../Bridge/BridgeBase';

interface BridgeOptions {
  webview_url: string;
}

interface ComponentProps {
  style?: any;
}

export const useChirpWebView = ({
  webview_url,
}: BridgeOptions): [BridgeBase, boolean, FunctionComponent<ComponentProps>] => {
  const webViewRef = useRef<any>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const bridge = useMemo(() => {
    return new BridgeInternal((event: object): void => {
      const bridgeEvent = BridgeCore.wrapBridgeEvent(event);
      webViewRef.current?.injectJavaScript(
        `(function() {
    window.dispatchEvent(new MessageEvent('message', {data: '${bridgeEvent}'}));
  })()`
      );
    });
  }, [webViewRef]);
  const publicBridge = useMemo(() => new BridgeBase(bridge), [bridge]);
  const onLoad = useCallback(() => setLoaded(true), []);
  const onMessage = useMemo(
    () => BridgeCore.webViewListener(bridge.handleCoreEvent),
    [bridge]
  );

  const Component: FunctionComponent<ComponentProps> = useCallback(
    ({ style, ...props }: ComponentProps) => {
      return (
        <WebView
          {...props}
          style={style}
          onLoad={onLoad}
          ref={webViewRef}
          javaScriptEnabled={true}
          mixedContentMode={'always'}
          source={{ uri: webview_url }}
          onMessage={onMessage}
        />
      );
    },
    [webview_url, onMessage, webViewRef, onLoad]
  );

  return [publicBridge, loaded, Component];
};
