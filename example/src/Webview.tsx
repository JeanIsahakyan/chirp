import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useChirpWebView } from '@jeanisahakyan/chirp';

export function Webview() {
  const [events, setEvents] = useState<any>([]);
  const [bridge, state, Component] = useChirpWebView({
    webview_url: `/bridge`,
  });
  useEffect(() => {
    if (state) {
      bridge
        .init({
          initWebView: (params) => {
            setEvents([
              ...events,
              JSON.stringify({
                event: 'Event from client',
                params,
              }),
            ]);
            return Promise.resolve();
          },
        })
        .catch(() => {
          setEvents([
            JSON.stringify({
              event: 'Init Failed',
            }),
          ]);
        });
    }
  }, [bridge, events, state]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.grow}>
        <Text>Webview Window</Text>
        <Button
          title="Send Event From WebView"
          onPress={() =>
            bridge
              .send('initClient', { ts: Date.now() })
              .then((e) => {
                setEvents([
                  ...events,
                  JSON.stringify({
                    event: 'Client result success',
                    data: e,
                  }),
                ]);
              })
              .catch((e) => {
                setEvents([
                  ...events,
                  JSON.stringify({
                    event: 'Client result reject',
                    data: e,
                  }),
                ]);
              })
          }
        />
        <View>
          <FlatList
            data={events}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
        </View>
      </View>
      <View style={styles.webview}>
        <Component style={styles.grow} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'stretch',
    position: 'relative',
    padding: 5,
  },
  button: {
    height: 50,
    borderRadius: 20,
    margin: 20,
    textAlign: 'center',
    backgroundColor: '#8AB840',
  },
  grow: {
    flexGrow: 1,
  },
  webview: {
    borderTopWidth: 1,
    borderColor: '#000',
    marginTop: 5,
    flexGrow: 1,
  },
});
