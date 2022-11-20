import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BridgeCore } from '../Bridge/BridgeCore';
import { BridgeInternal } from '../Bridge/BridgeInternal';
import { BridgeBase } from '../Bridge/BridgeBase';

interface BridgeOptions {
  webview_url: string;
}

interface ComponentProps {
  onError: (error: any) => void;
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
      webViewRef.current?.contentWindow?.postMessage(bridgeEvent, '*');
    });
  }, [webViewRef]);
  const publicBridge = useMemo(() => new BridgeBase(bridge), [bridge]);

  useEffect(() => {
    const unsubscribe = BridgeCore.subscribe(bridge.handleCoreEvent);
    return () => unsubscribe();
  }, [webview_url, bridge]);
  const onLoad = useCallback(() => setLoaded(true), []);
  const Component: FunctionComponent<ComponentProps> = useCallback(
    ({ style, ...props }: ComponentProps) => {
      return (
        <iframe
          {...props}
          onLoad={onLoad}
          ref={webViewRef}
          //eslint-disable-next-line react-native/no-inline-styles
          style={{
            border: 0,
            ...style,
          }}
          src={webview_url}
        />
      );
    },
    [webview_url, onLoad, webViewRef]
  );
  return [publicBridge, loaded, Component];
};
