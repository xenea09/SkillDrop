import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getFeed } from '../services/api';

export default function FeedScreen({ route }) {
    const { token } = route.params;
    const [drops, setDrops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeed = async () => {
            try {
                const data = await getFeed(token);
                setDrops(data);
            } catch (error) {
                console.error('Feed Fehler:', error);
            } finally {
                setLoading(false);
            }
        };
        loadFeed();
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1E3A5F" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dein Feed</Text>
            <FlatList
                data={drops}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.dropTitle}>{item.title}</Text>
                        <Text style={styles.dropType}>{item.type}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Noch keine Drops — abonniere Creator!</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    dropTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dropType: { fontSize: 12, color: '#888', marginTop: 4 },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});