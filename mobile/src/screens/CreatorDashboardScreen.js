import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getCreators } from '../services/api';

export default function CreatorDashboardScreen({ route, navigation }) {
    const { token } = route.params;
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCreators = async () => {
            try {
                const data = await getCreators(token);
                setCreators(data);
            } catch (error) {
                console.error('Fehler:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCreators();
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1E3A5F" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Creator Dashboard</Text>
            <FlatList
                data={creators}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.category}>{item.category}</Text>
                        <Text style={styles.bio}>{item.bio}</Text>
                        <Text style={styles.price}>CHF {item.pricePerMonth}/Monat</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Noch keine Creator</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 20 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
    category: { fontSize: 14, color: '#2E86C1', fontWeight: 'bold' },
    bio: { fontSize: 14, color: '#333', marginTop: 4 },
    price: { fontSize: 14, color: '#27AE60', marginTop: 8, fontWeight: 'bold' },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});