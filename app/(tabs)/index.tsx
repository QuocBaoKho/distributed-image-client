import { Image } from "expo-image";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import socket from "./services/socket";
import { useEffect, useState } from "react";
import { applyFilter } from "./utils/filter";
import { View } from "react-native-reanimated/lib/typescript/Animated";
interface TaskPayload {
  chunkId: number;
  chunkData: string;
  filter: string;
}
export default function HomeScreen() {
  const [chunkImage, setChunkImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Waiting for task...");
  const [results, setResults] = useState<{ chunkId: number; data: string }[]>(
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server!");
    });

    socket.on("task", async ({ chunkId, chunkData, filter }: TaskPayload) => {
      setStatus(`Processing chunk ${chunkId} with ${filter} filter`);
      setChunkImage(chunkData);

      const filtered = await applyFilter(chunkData, filter);

      socket.emit("result", {
        chunkId,
        filteredData: filtered,
      });
      setResults((prev) => [...prev, { chunkId, data: filtered }]);

      setStatus(`Chunk ${chunkId} done! Waiting for next task...`);
    });

    return () => {
      socket.off("task");
    };
  }, []);
  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    //   headerImage={
    //     <Image
    //       source={require("@/assets/images/partial-react-logo.png")}
    //       style={styles.reactLogo}
    //     />
    //   }
    // >
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Welcome!</ThemedText>
    //     <HelloWave />
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
    //     <ThemedText>
    //       Edit{" "}
    //       <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
    //       to see changes. Press{" "}
    //       <ThemedText type="defaultSemiBold">
    //         {Platform.select({
    //           ios: "cmd + d",
    //           android: "cmd + m",
    //           web: "F12",
    //         })}
    //       </ThemedText>{" "}
    //       to open developer tools.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
    //     <ThemedText>
    //       {`Tap the Explore tab to learn more about what's included in this starter app.`}
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
    //     <ThemedText>
    //       {`When you're ready, run `}
    //       <ThemedText type="defaultSemiBold">
    //         npm run reset-project
    //       </ThemedText>{" "}
    //       to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
    //       directory. This will move the current{" "}
    //       <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
    //       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
    //     </ThemedText>
    //   </ThemedView>
    // </ParallaxScrollView>
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle" style={styles.text}>
        {status}
      </ThemedText>

      {results.length > 0 ? (
        results
          .sort((a, b) => a.chunkId - b.chunkId)
          .map(({ chunkId, data }) => (
            <ThemedView key={chunkId} style={{ marginBottom: 20 }}>
              <ThemedText>Chunk {chunkId}</ThemedText>
              <Image
                source={{ uri: `data:image/png;base64,${data}` }}
                style={styles.image}
              />
            </ThemedView>
          ))
      ) : (
        <ActivityIndicator size="large" color="#ff4757" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: { marginBottom: 20, fontSize: 18 },
  image: { width: 300, height: 150, resizeMode: "contain", borderRadius: 10 },
});
