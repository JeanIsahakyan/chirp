import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WebView, WebViewProps } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import {
  BridgeCore,
  BridgeInternal,
  BridgeBase,
  BridgeOptions,
} from '@aspect/core';

/**
 * Options for the useAspectWebView hook
 */
export interface UseAspectWebViewOptions extends BridgeOptions {
  /** URL to load in the WebView */
  url: string;
}

/**
 * Props for the WebView component
 */
export interface AspectWebViewProps extends Omit<WebViewProps, 'source' | 'onMessage' | 'onLoad' | 'ref'> {
  /** Optional error handler */
  onError?: (error: unknown) => void;
}

/**
 * Return type for useAspectWebView hook
 */
export type UseAspectWebViewReturn = [
  /** Bridge instance for communication */
  bridge: BridgeBase,
  /** Whether the WebView has loaded */
  loaded: boolean,
  /** React component to render the WebView */
  WebViewComponent: FunctionComponent<AspectWebViewProps>
];

/**
 * React hook for embedding a WebView and communicating with it via Aspect bridge.
 *
 * @example
 * ```tsx
 * import { useAspectWebView } from '@aspect/react-native';
 *
 * function App() {
 *   const [bridge, loaded, WebView] = useAspectWebView({
 *     url: 'https://example.com/app'
 *   });
 *
 *   useEffect(() => {
 *     if (loaded) {
 *       bridge.init({
 *         getDeviceInfo: async () => ({
 *           platform: Platform.OS,
 *           version: Platform.Version
 *         })
 *       });
 *     }
 *   }, [loaded, bridge]);
 *
 *   const handlePress = async () => {
 *     const result = await bridge.send('greet', { name: 'Native' });
 *     console.log(result);
 *   };
 *
 *   return (
 *     <View style={{ flex: 1 }}>
 *       <WebView style={{ flex: 1 }} />
 *       <Button title="Send Message" onPress={handlePress} />
 *     </View>
 *   );
 * }
 * ```
 */
export const useAspectWebView = ({
  url,
  timeout,
}: UseAspectWebViewOptions): UseAspectWebViewReturn => {
  const webViewRef = useRef<WebView>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const bridge = useMemo(() => {
    return new BridgeInternal((event: object): void => {
      const bridgeEvent = BridgeCore.wrapBridgeEvent(event);
      webViewRef.current?.injectJavaScript(
        `(function() {
          window.dispatchEvent(new MessageEvent('message', {data: '${bridgeEvent}'}));
        })()`
      );
    }, { timeout });
  }, [timeout]);

  const publicBridge = useMemo(() => new BridgeBase(bridge), [bridge]);

  const onLoad = useCallback(() => setLoaded(true), []);

  const onMessage = useMemo(
    () => {
      const listener = BridgeCore.webViewListener(
        bridge.handleCoreEvent as (event: unknown) => void
      );
      return (event: WebViewMessageEvent) => {
        listener({
          nativeEvent: {
            data: event.nativeEvent.data,
          },
        });
      };
    },
    [bridge]
  );

  const WebViewComponent: FunctionComponent<AspectWebViewProps> = useCallback(
    ({ style, onError, ...props }: AspectWebViewProps) => {
      return (
        <WebView
          {...props}
          style={style}
          onLoad={onLoad}
          ref={webViewRef}
          javaScriptEnabled={true}
          mixedContentMode="always"
          source={{ uri: url }}
          onMessage={onMessage}
          onError={onError ? (syntheticEvent) => onError(syntheticEvent.nativeEvent) : undefined}
        />
      );
    },
    [url, onMessage, onLoad]
  );

  return [publicBridge, loaded, WebViewComponent];
};
