import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="translator" options={{ title: "Translator Page" }} />
      <Tabs.Screen name="ocr" options={{ title: "OCR Screen Page" }} />
    </Tabs>
  );
}
