import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, SafeAreaView, ScrollView, Switch, Alert, Image, Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { saveProfile, getProfile, clearAuth, getToken } from '../services/storage';
import PostEditor from '../components/PostEditor';
import { jwtDecode } from 'jwt-decode';

export default function ProfileScreen({ route, navigation }) {
    const [token, setToken] = useState(route.params?.token || null);
    const [email, setEmail] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [category, setCategory] = useState('');
    const [bio, setBio] = useState('');
    const [price, setPrice] = useState('5');
    const [profileImage, setProfileImage] = useState(null);
    const [editMode, setEditMode] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                let currentToken = token;
                if (!currentToken) {
                    currentToken = await getToken();
                    setToken(currentToken);
                }
                if (!currentToken) return;

                const decoded = jwtDecode(currentToken);
                const userEmail = decoded.sub;
                setEmail(userEmail);

                const saved = await getProfile(userEmail);
                if (saved) {
                    setIsCreator(saved.isCreator || false);
                    setCategory(saved.category || '');
                    setBio(saved.bio || '');
                    setPrice(saved.price || '5');
                    setProfileImage(saved.profileImage || null);
                    setMyPosts(saved.myPosts || []);
                    if (saved.category) setEditMode(false);
                }
            } catch (e) {
                console.log('Error:', e);
            }
        };
        loadProfile();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        await saveProfile(email, { isCreator, category, bio, price, profileImage, myPosts });
        Alert.alert('Gespeichert!', 'Dein Profil wurde gespeichert.');
    };

    const handleDelete = (id) => {
        Alert.alert('Löschen', 'Willst du diesen Post wirklich löschen?', [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Löschen', style: 'destructive', onPress: async () => {
                const updated = myPosts.filter(p => p.id !== id);
                setMyPosts(updated);
                await saveProfile(email, { isCreator, category, bio, price, profileImage, myPosts: updated });
            }}
        ]);
    };

    const handleLogout = async () => {
        await clearAuth();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Mein Profil</Text>

                <View style={styles.imageSection}>
                    <TouchableOpacity onPress={pickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>📷</Text>
                                <Text style={styles.avatarLabel}>Foto hinzufügen</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Creator werden</Text>
                    <Switch
                        value={isCreator}
                        onValueChange={setIsCreator}
                        trackColor={{ true: '#1E3A5F' }}
                    />
                </View>

                {isCreator && (
                    <>
                        {editMode ? (
                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>Creator Profil</Text>

                                <Text style={styles.label}>Dein Thema</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="z.B. Programmieren, Kochen..."
                                    value={category}
                                    onChangeText={setCategory}
                                />

                                <Text style={styles.label}>Einführungstext</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Erzähl etwas über dich..."
                                    value={bio}
                                    onChangeText={setBio}
                                    multiline
                                    numberOfLines={4}
                                />

                                <Text style={styles.label}>Preis pro Monat (CHF)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="5"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />

                                <TouchableOpacity style={styles.saveButton} onPress={async () => {
                                    await handleSave();
                                    setEditMode(false);
                                }}>
                                    <Text style={styles.saveButtonText}>💾 Speichern</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.compactCard}>
                                <View style={styles.compactInfo}>
                                    <Text style={styles.compactCategory}>📚 {category}</Text>
                                    <Text style={styles.compactBio} numberOfLines={1}>{bio}</Text>
                                    <Text style={styles.compactPrice}>CHF {price}/Monat</Text>
                                </View>
                                <TouchableOpacity onPress={() => setEditMode(true)} style={styles.editIconBtn}>
                                    <Text style={styles.editIcon}>✏️</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.formCard}>
                            <View style={styles.postsHeader}>
                                <Text style={styles.formTitle}>Meine Posts</Text>
                                <TouchableOpacity style={styles.addPostBtn} onPress={() => {
                                    setEditingPost(null);
                                    setShowCreatePost(true);
                                }}>
                                    <Text style={styles.addPostText}>+ Erstellen</Text>
                                </TouchableOpacity>
                            </View>

                            {myPosts.length === 0 && (
                                <Text style={styles.emptyPosts}>Noch keine Posts erstellt</Text>
                            )}

                            {myPosts.map(post => (
                                <View key={post.id} style={styles.postItem}>
                                    <View style={styles.postInfo}>
                                        <Text style={styles.postTitle}>{post.title}</Text>
                                    </View>
                                    <View style={styles.postActions}>
                                        <TouchableOpacity style={styles.editBtn} onPress={() => {
                                            setEditingPost(post);
                                            setShowCreatePost(true);
                                        }}>
                                            <Text>✏️</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteBtn}
                                            onPress={() => handleDelete(post.id)}>
                                            <Text>🗑️</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪 Ausloggen</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showCreatePost} animationType="slide">
                <PostEditor
                    initialPost={editingPost}
                    onSave={async (post) => {
                        let updated;
                        if (editingPost) {
                            updated = myPosts.map(p => p.id === post.id ? post : p);
                        } else {
                            updated = [...myPosts, post];
                        }
                        setMyPosts(updated);
                        await saveProfile(email, { isCreator, category, bio, price, profileImage, myPosts: updated });
                        setShowCreatePost(false);
                        setEditingPost(null);
                    }}
                    onClose={() => {
                        setShowCreatePost(false);
                        setEditingPost(null);
                    }}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A5F', padding: 20 },
    imageSection: { alignItems: 'center', marginBottom: 10 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 30 },
    avatarLabel: { fontSize: 11, color: '#888', marginTop: 4 },
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, elevation: 2 },
    cardLabel: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    formCard: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, elevation: 2 },
    formTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E3A5F', marginBottom: 15 },
    label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 15, backgroundColor: '#fafafa' },
    textArea: { height: 100, textAlignVertical: 'top' },
    saveButton: { backgroundColor: '#1E3A5F', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    compactCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 12, elevation: 2 },
    compactInfo: { flex: 1 },
    compactCategory: { fontSize: 15, fontWeight: 'bold', color: '#1E3A5F' },
    compactBio: { fontSize: 13, color: '#555', marginTop: 3 },
    compactPrice: { fontSize: 13, color: '#27AE60', marginTop: 3, fontWeight: 'bold' },
    editIconBtn: { padding: 8 },
    editIcon: { fontSize: 20 },
    postsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    addPostBtn: { backgroundColor: '#1E3A5F', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    addPostText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
    emptyPosts: { textAlign: 'center', color: '#888', marginVertical: 15 },
    postItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    postInfo: { flex: 1 },
    postTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    postActions: { flexDirection: 'row', gap: 10 },
    editBtn: { padding: 8 },
    deleteBtn: { padding: 8 },
    logoutButton: { margin: 15, padding: 15, borderRadius: 10, alignItems: 'center', backgroundColor: '#fee' },
    logoutText: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
});