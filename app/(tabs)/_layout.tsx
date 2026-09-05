import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { ColorValue, Platform } from 'react-native';

import { Theme } from '@/constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Theme.colors.accent,
        tabBarInactiveTintColor: Theme.colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Theme.colors.tabBar,
          borderTopColor: Theme.colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        sceneStyle: {
          backgroundColor: Theme.colors.background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <MaterialCommunityIcons name="speedometer" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log-book"
        options={{
          title: 'Log Book',
          tabBarLabel: 'Log Book',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarLabel: 'Records',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="garage"
        options={{
          title: 'Garage',
          tabBarLabel: 'Garage',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <MaterialCommunityIcons name="motorbike" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rider-hub"
        options={{
          title: 'Rider Hub',
          tabBarLabel: 'Rider Hub',
          tabBarIcon: ({ color, size }: { color: ColorValue; size: number }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
