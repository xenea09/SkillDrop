import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, ScrollView, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function PostEditor({ onSave, onClose, initialPost }) {
    const [title, setTitle] = useState(initialPost?.title || '');
    const [blocks, setBlocks] = useState(initialPost?.blocks || []);

    const addBlock = (type) => {
        setBlocks([...blocks, { id: Date.now(), type, content: null }]);
    };

    const updateBlock = (id, content) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const removeBlock = (id) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const pickImage = async (id) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) updateBlock(id, result.assets[0].uri);
    };

    const pickVideo = async (id) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });
        if (!result.canceled) updateBlock(id, result.assets[0].uri);
    };

    const pickFile = async (id) => {
        const result = await DocumentPicker.getDocumentAsync();
        if (!result.canceled) updateBlock(id, result.assets[0].uri);
    };

    const handleSave = () => {
    if (!title) {
        Alert.alert('Fehler', 'Bitte gib einen Titel ein');
        return;
    }
    onSave({ id: initialPost?.id || Date.now(), title, blocks });
    };

    const renderBlock = (block) => {
        switch (block.type) {
            case 'TEXT':
                return (
                    <View key={block.id} style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockLabel}>📝 Text</Text>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Text style={styles.removeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.textBlock}
                            placeholder="Schreib etwas..."
                            multiline
                            value={block.content || ''}
                            onChangeText={(text) => updateBlock(block.id, text)}
                        />
                    </View>
                );
            case 'IMAGE':
                return (
                    <View key={block.id} style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockLabel}>📸 Bild</Text>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Text style={styles.removeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {block.content ? (
                            <Image source={{ uri: block.content }} style={styles.previewImage} />
                        ) : (
                            <TouchableOpacity style={styles.mediaPicker} onPress={() => pickImage(block.id)}>
                                <Text style={styles.mediaPickerIcon}>📸</Text>
                                <Text style={styles.mediaPickerText}>Bild auswählen</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            case 'VIDEO':
                return (
                    <View key={block.id} style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockLabel}>🎥 Video</Text>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Text style={styles.removeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {block.content ? (
                            <View style={styles.videoPreview}>
                                <Text style={styles.videoIcon}>🎥</Text>
                                <Text style={styles.videoText}>Video ausgewählt</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.mediaPicker} onPress={() => pickVideo(block.id)}>
                                <Text style={styles.mediaPickerIcon}>🎥</Text>
                                <Text style={styles.mediaPickerText}>Video auswählen</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            case 'AUDIO':
                return (
                    <View key={block.id} style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockLabel}>🎙️ Audio</Text>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Text style={styles.removeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.audioBox}>
                            <TouchableOpacity style={styles.recordBtn}>
                                <Text style={styles.recordBtnText}>⏺ Aufnahme starten</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 'FILE':
                return (
                    <View key={block.id} style={styles.block}>
                        <View style={styles.blockHeader}>
                            <Text style={styles.blockLabel}>📎 Datei</Text>
                            <TouchableOpacity onPress={() => removeBlock(block.id)}>
                                <Text style={styles.removeBtn}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        {block.content ? (
                            <View style={styles.filePreview}>
                                <Text>📎 Datei ausgewählt</Text>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.mediaPicker} onPress={() => pickFile(block.id)}>
                                <Text style={styles.mediaPickerIcon}>📎</Text>
                                <Text style={styles.mediaPickerText}>Datei auswählen</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.cancelBtn}>Abbrechen</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post erstellen</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveBtn}>Speichern</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <TextInput
                    style={styles.titleInput}
                    placeholder="Titel..."
                    value={title}
                    onChangeText={setTitle}
                    fontSize={22}
                />

                {blocks.map(renderBlock)}

                <Text style={styles.addBlockLabel}>Block hinzufügen:</Text>
                <View style={styles.blockButtons}>
                    {[
                        { type: 'TEXT', icon: '📝', label: 'Text' },
                        { type: 'IMAGE', icon: '📸', label: 'Bild' },
                        { type: 'VIDEO', icon: '🎥', label: 'Video' },
                        { type: 'AUDIO', icon: '🎙️', label: 'Audio' },
                        { type: 'FILE', icon: '📎', label: 'Datei' },
                    ].map(({ type, icon, label }) => (
                        <TouchableOpacity
                            key={type}
                            style={styles.blockBtn}
                            onPress={() => addBlock(type)}>
                            <Text style={styles.blockBtnIcon}>{icon}</Text>
                            <Text style={styles.blockBtnLabel}>{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
    headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E3A5F' },
    cancelBtn: { color: '#888', fontSize: 15 },
    saveBtn: { color: '#1E3A5F', fontSize: 15, fontWeight: 'bold' },
    content: { flex: 1, padding: 15 },
    titleInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 22, fontWeight: 'bold' },
    block: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 1 },
    blockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    blockLabel: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    removeBtn: { color: '#e74c3c', fontSize: 16, fontWeight: 'bold' },
    textBlock: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, minHeight: 80, textAlignVertical: 'top' },
    mediaPicker: { alignItems: 'center', padding: 25, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', borderRadius: 8 },
    mediaPickerIcon: { fontSize: 35 },
    mediaPickerText: { color: '#888', marginTop: 8 },
    previewImage: { width: '100%', height: 200, borderRadius: 8 },
    videoPreview: { alignItems: 'center', padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8 },
    videoIcon: { fontSize: 40 },
    videoText: { color: '#555', marginTop: 8 },
    audioBox: { alignItems: 'center', padding: 20 },
    recordBtn: { backgroundColor: '#1E3A5F', padding: 12, borderRadius: 25, paddingHorizontal: 25 },
    recordBtnText: { color: '#fff', fontWeight: 'bold' },
    filePreview: { alignItems: 'center', padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    addBlockLabel: { fontSize: 13, color: '#888', marginBottom: 10, marginTop: 5 },
    blockButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
    blockBtn: { alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12, width: 65, elevation: 1 },
    blockBtnIcon: { fontSize: 24 },
    blockBtnLabel: { fontSize: 11, color: '#555', marginTop: 4 },
});