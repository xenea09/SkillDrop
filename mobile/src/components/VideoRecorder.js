import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import VideoPlayer from './VideoPlayer';

export default function VideoRecorder({ onRecorded }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUri, setRecordedUri] = useState(null);
    const cameraRef = useRef(null);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.permissionBox}>
                <Text style={styles.permissionText}>Kamera Zugriff benötigt</Text>
                <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                    <Text style={styles.permissionBtnText}>Erlauben</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const startRecording = async () => {
        if (cameraRef.current) {
            setIsRecording(true);
            const video = await cameraRef.current.recordAsync({ maxDuration: 60 });
            setRecordedUri(video.uri);
            onRecorded(video.uri);
        }
    };

    const stopRecording = () => {
        if (cameraRef.current) {
            cameraRef.current.stopRecording();
            setIsRecording(false);
        }
    };

    if (recordedUri) {
        return (
            <View style={styles.doneBox}>
                <Text style={styles.doneText}>✅ Video aufgenommen!</Text>
                <VideoPlayer uri={recordedUri} />
                <TouchableOpacity style={styles.retryBtn} onPress={() => setRecordedUri(null)}>
                    <Text style={styles.retryText}>🔄 Nochmal aufnehmen</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                mode="video"
                facing="back">
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.recordBtn, isRecording && styles.recordingBtn]}
                        onPress={isRecording ? stopRecording : startRecording}>
                        <Text style={styles.recordIcon}>{isRecording ? '⏹' : '⏺'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.recordLabel}>
                        {isRecording ? 'Stoppen' : 'Aufnehmen'}
                    </Text>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { height: 300, borderRadius: 12, overflow: 'hidden' },
    camera: { flex: 1 },
    controls: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 },
    recordBtn: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    recordingBtn: { backgroundColor: '#e74c3c' },
    recordIcon: { fontSize: 30 },
    recordLabel: { color: '#fff', marginTop: 8, fontWeight: 'bold' },
    permissionBox: { alignItems: 'center', padding: 30 },
    permissionText: { fontSize: 15, color: '#555', marginBottom: 15 },
    permissionBtn: { backgroundColor: '#1E3A5F', padding: 12, borderRadius: 8 },
    permissionBtnText: { color: '#fff', fontWeight: 'bold' },
    doneBox: { padding: 10 },
    doneText: { fontSize: 16, color: '#27AE60', fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    retryBtn: { alignItems: 'center', padding: 10, marginTop: 10 },
    retryText: { color: '#888' },
});