import * as React from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';
import { ChirpBridge } from '@jeanisahakyan/chirp';
import { useEffect, useState } from 'react';

const chirpBridge = new ChirpBridge();

export function Bridge() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    chirpBridge
      .init({
        initClient: (params) => {
          setEvents([
            ...events,
            JSON.stringify({
              event: 'Event from WebView',
              params,
            }),
          ]);
          return Promise.resolve();
        },
      })
      .catch(() => {
        setEvents([
          JSON.stringify({
            event: 'Init error',
          }),
        ]);
      });
  }, [events]);
  return (
    <View style={styles.container}>
      <Text>Child window</Text>
      <Button
        title="Send Event From Child window"
        onPress={() =>
          chirpBridge
            .send('initWebView', { ts: Date.now() })
            .then((e) => {
              setEvents([
                ...events,
                JSON.stringify({
                  event: 'WebView result success',
                  data: e,
                }),
              ]);
            })
            .catch((e) => {
              setEvents([
                ...events,
                JSON.stringify({
                  event: 'WebView result reject',
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    alignItems: 'stretch',
    position: 'relative',
  },
});
