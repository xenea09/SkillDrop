import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoPlayer({ uri }) {
    const player = useVideoPlayer(uri, player => {
        player.loop = false;
    });

    return (
        <View style={styles.container}>
            <VideoView
                style={styles.video}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { borderRadius: 8, overflow: 'hidden', marginTop: 10 },
    video: { width: '100%', height: 200 },
});