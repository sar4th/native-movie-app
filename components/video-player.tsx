import { StyleSheet, View, ActivityIndicator } from "react-native";
import WebView from "react-native-webview";
import { useState } from "react";

import { ServerDropdown } from "./ServerDropdown";
export const WebViewVideoPlayer = ({ movieVideoId }: string) => {
  const [loading, setLoading] = useState(true);

  const [url, setUrl] = useState(`https://vidlink.pro/movie/${movieVideoId}`);
  console.log(url, "url");
  return (
    <>
      <View style={styles.wrapper}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#a855f7"
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <WebView
          style={styles.webview}
          source={{ uri: url }}
          onLoadEnd={() => setLoading(false)}
          allowsFullscreenVideo
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          allowsInlineMediaPlayback
          startInLoadingState
        />
      </View>
      <ServerDropdown
        onSelect={(selectedUrl) => setUrl(selectedUrl)}
        movieId={movieVideoId}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 220,
    marginVertical: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#a855f7",
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: "#050011",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
