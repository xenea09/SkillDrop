import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

export default function AudioPlayer({ uri }) {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = async () => {
        if (isPlaying) {
            await sound.stopAsync();
            setIsPlaying(false);
            return;
        }
        const { sound: newSound } = await Audio.Sound.createAsync({ uri });
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) setIsPlaying(false);
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.playBtn} onPress={togglePlay}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
                <Text style={styles.playText}>{isPlaying ? 'Pause' : 'Abspielen'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 10 },
    playBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E3A5F', padding: 12, borderRadius: 25, paddingHorizontal: 20 },
    playIcon: { fontSize: 20, marginRight: 8 },
    playText: { color: '#fff', fontWeight: 'bold' },
});