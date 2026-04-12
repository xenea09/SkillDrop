import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import FeedScreen from './src/screens/FeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CreatorPostsScreen from './src/screens/CreatorPostsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ route }) {
    const { token } = route.params;
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#1E3A5F',
                tabBarInactiveTintColor: '#888',
                headerShown: false,
            }}>
            <Tab.Screen
                name="Entdecken"
                component={DiscoverScreen}
                initialParams={{ token }}
                options={{ tabBarIcon: () => <Text>🔍</Text> }}
            />
            <Tab.Screen
                name="Feed"
                component={FeedScreen}
                initialParams={{ token }}
                options={{ tabBarIcon: () => <Text>📱</Text> }}
            />
            <Tab.Screen
                name="Profil"
                component={ProfileScreen}
                initialParams={{ token }}
                options={{ tabBarIcon: () => <Text>👤</Text> }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="CreatorPosts" component={CreatorPostsScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}