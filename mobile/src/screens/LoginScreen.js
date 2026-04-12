import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            navigation.navigate('Feed', { token: data.token });
        } catch (error) {
            Alert.alert('Fehler', 'Login fehlgeschlagen');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SkillDrop</Text>
            <TextInput
                style={styles.input}
                placeholder="E-Mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Passwort"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Einloggen</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#1E3A5F' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
    button: { backgroundColor: '#1E3A5F', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});