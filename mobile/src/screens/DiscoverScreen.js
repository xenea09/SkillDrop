import React, { useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet, TextInput,
    TouchableOpacity, Image, SafeAreaView
} from 'react-native';
import { getCreators } from '../services/api';

export default function DiscoverScreen({ route, navigation }) {
    const { token } = route.params;
    const [creators, setCreators] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getCreators(token).then(setCreators).catch(console.error);
    }, []);

    const filtered = creators.filter(c =>
        c.category?.toLowerCase().includes(search.toLowerCase()) ||
        c.bio?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.logo}>SkillDrop</Text>
            <TextInput
                style={styles.search}
                placeholder="🔍  Suche nach Kochen, Coding..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('CreatorDetail', { creator: item, token })}>
                        <Image
                            source={{ uri: 'https://ui-avatars.com/api/?name=' + item.category + '&background=1E3A5F&color=fff&size=128' }}
                            style={styles.avatar}
                        />
                        <View style={styles.info}>
                            <Text style={styles.category}>{item.category}</Text>
                            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
                            <Text style={styles.price}>CHF {item.pricePerMonth}/Monat</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Keine Creator gefunden</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    logo: { fontSize: 28, fontWeight: 'bold', color: '#1E3A5F', textAlign: 'center', paddingTop: 20, paddingBottom: 10 },
    search: { margin: 15, padding: 12, backgroundColor: '#fff', borderRadius: 25, fontSize: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    card: { flexDirection: 'row', backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
    avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#1E3A5F' },
    info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    category: { fontSize: 16, fontWeight: 'bold', color: '#1E3A5F' },
    bio: { fontSize: 13, color: '#555', marginTop: 4 },
    price: { fontSize: 13, color: '#27AE60', marginTop: 6, fontWeight: 'bold' },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});