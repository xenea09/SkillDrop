import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, Image, SafeAreaView
} from 'react-native';
import { getFeed } from '../services/api';

export default function FeedScreen({ route, navigation }) {
    const { token } = route.params;
    const [subscribed, setSubscribed] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFeed(token).then(data => {
            // Gruppiere Drops nach Creator
            const creators = {};
            data.forEach(drop => {
                const creatorId = drop.creatorId || 'unknown';
                if (!creators[creatorId]) {
                    creators[creatorId] = { id: creatorId, drops: [] };
                }
                creators[creatorId].drops.push(drop);
            });
            setSubscribed(Object.values(creators));
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <View style={styles.center}><Text>Laden...</Text></View>;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Meine Creator</Text>
            <FlatList
                data={subscribed}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('CreatorPosts', { drops: item.drops, token })}>
                        <Image
                            source={{ uri: 'https://ui-avatars.com/api/?name=Creator&background=1E3A5F&color=fff&size=128' }}
                            style={styles.avatar}
                        />
                        <View style={styles.info}>
                            <Text style={styles.name}>Creator</Text>
                            <Text style={styles.count}>{item.drops.length} Drops</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyIcon}>😔</Text>
                        <Text style={styles.empty}>Du hast niemanden abonniert</Text>
                        <Text style={styles.emptySub}>Entdecke Creator im Entdecken Tab!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A5F', padding: 20 },
    card: { flexDirection: 'row', backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 15, elevation: 3 },
    avatar: { width: 60, height: 60, borderRadius: 30 },
    info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    name: { fontSize: 16, fontWeight: 'bold', color: '#1E3A5F' },
    count: { fontSize: 13, color: '#888', marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyBox: { alignItems: 'center', marginTop: 80 },
    emptyIcon: { fontSize: 50, marginBottom: 15 },
    empty: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    emptySub: { fontSize: 14, color: '#888', marginTop: 8 },
});