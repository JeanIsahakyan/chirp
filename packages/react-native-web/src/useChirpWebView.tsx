import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
} from 'react';
import {
  BridgeCore,
  BridgeInternal,
  BridgeBase,
  BridgeOptions,
} from '@aspect/core';

/**
 * Options for the useChirpWebView hook (web platform)
 */
export interface UseChirpWebViewOptions extends BridgeOptions {
  /** URL to load in the iframe/WebView */
  url: string;
}

/**
 * Props for the component (web platform uses iframe)
 */
export interface ChirpWebViewProps {
  /** Optional error handler */
  onError?: (error: unknown) => void;
  /** Custom styles */
  style?: CSSProperties;
  /** Class name */
  className?: string;
  /** Title for accessibility */
  title?: string;
  /** Sandbox attribute for iframe */
  sandbox?: string;
  /** Allow attribute for iframe */
  allow?: string;
}

/**
 * Return type for useChirpWebView hook
 */
export type UseChirpWebViewReturn = [
  /** Bridge instance for communication */
  bridge: BridgeBase,
  /** Whether the content has loaded */
  loaded: boolean,
  /** React component to render the iframe */
  WebViewComponent: FunctionComponent<ChirpWebViewProps>
];

/**
 * React hook for React Native Web that provides cross-platform
 * WebView-like functionality using iframes.
 *
 * This hook provides the same API as @aspect/react-native's useChirpWebView
 * but uses iframes for the web platform.
 *
 * @example
 * ```tsx
 * import { useChirpWebView } from '@aspect/react-native-web';
 *
 * function App() {
 *   const [bridge, loaded, WebView] = useChirpWebView({
 *     url: 'https://example.com/widget'
 *   });
 *
 *   useEffect(() => {
 *     if (loaded) {
 *       bridge.init({
 *         getData: async () => ({ user: 'John' })
 *       });
 *     }
 *   }, [loaded, bridge]);
 *
 *   return (
 *     <View style={{ flex: 1 }}>
 *       <WebView style={{ flex: 1 }} />
 *     </View>
 *   );
 * }
 * ```
 */
export const useChirpWebView = ({
  url,
  timeout,
}: UseChirpWebViewOptions): UseChirpWebViewReturn => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const bridge = useMemo(() => {
    return new BridgeInternal((event: object): void => {
      const bridgeEvent = BridgeCore.wrapBridgeEvent(event);
      iframeRef.current?.contentWindow?.postMessage(bridgeEvent, '*');
    }, { timeout });
  }, [timeout]);

  const publicBridge = useMemo(() => new BridgeBase(bridge), [bridge]);

  useEffect(() => {
    const unsubscribe = BridgeCore.subscribe(bridge.handleCoreEvent);
    return () => unsubscribe();
  }, [bridge]);

  const onLoad = useCallback(() => setLoaded(true), []);

  const WebViewComponent: FunctionComponent<ChirpWebViewProps> = useCallback(
    ({ style, className, title, sandbox, allow, ...props }: ChirpWebViewProps) => {
      return (
        <iframe
          {...props}
          onLoad={onLoad}
          ref={iframeRef}
          className={className}
          title={title ?? 'Embedded content'}
          sandbox={sandbox}
          allow={allow}
          style={{
            border: 0,
            width: '100%',
            height: '100%',
            ...style,
          }}
          src={url}
        />
      );
    },
    [url, onLoad]
  );

  return [publicBridge, loaded, WebViewComponent];
};
