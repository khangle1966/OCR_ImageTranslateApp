import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ tabBarLabel: 'Home' }}
      />
      <Tabs.Screen
        name="ocr"
        options={{ tabBarLabel: 'OCR' }}
      />
      <Tabs.Screen
        name="translator"
        options={{ tabBarLabel: 'Translator' }}
      />
    </Tabs>
  );
}
