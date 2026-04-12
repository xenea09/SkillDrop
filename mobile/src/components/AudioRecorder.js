import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioRecorder({ onRecorded }) {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUri, setRecordedUri] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setIsRecording(true);
        } catch (e) {
            console.error('Aufnahme Fehler:', e);
        }
    };

    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordedUri(uri);
            setIsRecording(false);
            setRecording(null);
            onRecorded(uri);
        } catch (e) {
            console.error('Stop Fehler:', e);
        }
    };

    const playSound = async () => {
        if (isPlaying) {
            await sound.stopAsync();
            setIsPlaying(false);
            return;
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordedUri });
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) setIsPlaying(false);
        });
    };

    return (
        <View style={styles.container}>
            {!recordedUri ? (
                <TouchableOpacity
                    style={[styles.recordBtn, isRecording && styles.recordingBtn]}
                    onPress={isRecording ? stopRecording : startRecording}>
                    <Text style={styles.recordIcon}>{isRecording ? '⏹' : '⏺'}</Text>
                    <Text style={styles.recordText}>
                        {isRecording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.playbackBox}>
                    <Text style={styles.doneText}>✅ Aufnahme fertig!</Text>
                    <TouchableOpacity style={styles.playBtn} onPress={playSound}>
                        <Text style={styles.playText}>{isPlaying ? '⏸ Pause' : '▶️ Abspielen'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.retryBtn} onPress={() => {
                        setRecordedUri(null);
                        setIsPlaying(false);
                    }}>
                        <Text style={styles.retryText}>🔄 Nochmal aufnehmen</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 10 },
    recordBtn: { alignItems: 'center', backgroundColor: '#1E3A5F', padding: 20, borderRadius: 50, margin: 10 },
    recordingBtn: { backgroundColor: '#e74c3c' },
    recordIcon: { fontSize: 40 },
    recordText: { color: '#fff', marginTop: 8, fontWeight: 'bold' },
    playbackBox: { alignItems: 'center', padding: 15 },
    doneText: { fontSize: 16, color: '#27AE60', fontWeight: 'bold', marginBottom: 15 },
    playBtn: { backgroundColor: '#1E3A5F', padding: 12, borderRadius: 8, paddingHorizontal: 25, marginBottom: 10 },
    playText: { color: '#fff', fontWeight: 'bold' },
    retryBtn: { padding: 10 },
    retryText: { color: '#888' },
});