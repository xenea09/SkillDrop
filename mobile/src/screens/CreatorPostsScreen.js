import React from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, SafeAreaView
} from 'react-native';

export default function CreatorPostsScreen({ route, navigation }) {
    const { drops } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Zurück</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Posts</Text>
            <FlatList
                data={drops}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.dropTitle}>{item.title}</Text>
                        <Text style={styles.dropType}>{item.type}</Text>
                        <Text style={styles.dropDate}>
                            {new Date(item.publishedAt).toLocaleDateString('de-CH')}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>Noch keine Posts</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    back: { padding: 15 },
    backText: { color: '#1E3A5F', fontSize: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A5F', paddingHorizontal: 20, marginBottom: 10 },
    card: { backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 15, elevation: 2 },
    dropTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    dropType: { fontSize: 12, color: '#2E86C1', marginTop: 4 },
    dropDate: { fontSize: 12, color: '#888', marginTop: 4 },
    empty: { textAlign: 'center', color: '#888', marginTop: 40 },
});