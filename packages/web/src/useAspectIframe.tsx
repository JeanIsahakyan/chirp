import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
  IframeHTMLAttributes,
} from 'react';
import {
  BridgeCore,
  BridgeInternal,
  BridgeBase,
  BridgeOptions,
} from '@aspect/core';

/**
 * Options for the useAspectIframe hook
 */
export interface UseAspectIframeOptions extends BridgeOptions {
  /** URL to load in the iframe */
  url: string;
}

/**
 * Props for the iframe component
 */
export interface AspectIframeProps
  extends Omit<IframeHTMLAttributes<HTMLIFrameElement>, 'src' | 'onLoad'> {
  /** Optional error handler */
  onError?: (error: unknown) => void;
  /** Custom styles */
  style?: CSSProperties;
}

/**
 * Return type for useAspectIframe hook
 */
export type UseAspectIframeReturn = [
  /** Bridge instance for communication */
  bridge: BridgeBase,
  /** Whether the iframe has loaded */
  loaded: boolean,
  /** React component to render the iframe */
  IframeComponent: FunctionComponent<AspectIframeProps>
];

/**
 * React hook for embedding an iframe and communicating with it via Aspect bridge.
 *
 * @example
 * ```tsx
 * import { useAspectIframe } from '@aspect/web';
 *
 * function App() {
 *   const [bridge, loaded, Iframe] = useAspectIframe({
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
 *   const handleClick = async () => {
 *     const result = await bridge.send('greet', { name: 'World' });
 *     console.log(result);
 *   };
 *
 *   return (
 *     <div>
 *       <Iframe style={{ width: '100%', height: 400 }} />
 *       <button onClick={handleClick}>Send Message</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useAspectIframe = ({
  url,
  timeout,
}: UseAspectIframeOptions): UseAspectIframeReturn => {
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
    const unsubscribe = BridgeCore.subscribe(
      bridge.handleCoreEvent as (event: unknown) => void
    );
    return () => unsubscribe();
  }, [bridge]);

  const onLoad = useCallback(() => setLoaded(true), []);

  const IframeComponent: FunctionComponent<AspectIframeProps> = useCallback(
    ({ style, ...props }: AspectIframeProps) => {
      return (
        <iframe
          {...props}
          onLoad={onLoad}
          ref={iframeRef}
          style={{
            border: 0,
            ...style,
          }}
          src={url}
        />
      );
    },
    [url, onLoad]
  );

  return [publicBridge, loaded, IframeComponent];
};
