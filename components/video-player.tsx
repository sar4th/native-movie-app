import * as ScreenOrientation from "expo-screen-orientation";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import WebView from "react-native-webview";
import { useState, useRef } from "react";
import { ServerDropdown } from "./ServerDropdown";

export const WebViewVideoPlayer = ({
  movieVideoId,
}: {
  movieVideoId: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(`https://vidlink.pro/movie/${movieVideoId}`);
  const webViewRef = useRef(null);

  const injectedJavascript = `
    (function() {
      const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "msfullscreenchange"];
      events.forEach(event => {
        document.addEventListener(event, function() {
          const isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          );
          window.ReactNativeWebView.postMessage(JSON.stringify({ fullscreen: isFullscreen }));
        });
      });
    })();
    true;
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.fullscreen === true) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE,
        );
      } else {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      }
    } catch (err) {
      console.log("Orientation error", err);
    }
  };

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
          ref={webViewRef}
          style={styles.webview}
          source={{ uri: url }}
          onLoadEnd={() => setLoading(false)}
          allowsFullscreenVideo
          javaScriptEnabled
          startInLoadingState
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          onMessage={handleMessage}
          injectedJavaScript={injectedJavascript}
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
