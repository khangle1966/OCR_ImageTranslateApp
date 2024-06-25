import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const OCRScreenPage: React.FC = () => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [translatedText, setTranslatedText] = useState<string>('');
    const [targetLanguage, setTargetLanguage] = useState<string>('vi');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
                Alert.alert('Permission required', 'Please grant camera and media library permissions to use this feature.');
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            handleOcr(result.assets[0]);
        }
    };

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            handleOcr(result.assets[0]);
        }
    };

    const handleOcr = async (image: ImagePicker.ImagePickerAsset) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', {
            uri: image.uri,
            type: 'image/jpeg', // or the appropriate type of your image
            name: 'photo.jpg',
        } as any);

        try {
            const ocrResponse = await axios.post('http://10.106.21.33:5000/ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const { text } = ocrResponse.data;
            handleTranslate(text);
        } catch (error) {
            console.error('Error performing OCR:', error);
            setLoading(false);
        }
    };

    const handleTranslate = async (text: string) => {
        try {
            const translateResponse = await axios.post('http://10.106.21.33:5000/translate', {
                text: text,
                targetLanguage: targetLanguage,
            });
            setTranslatedText(translateResponse.data.translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>OCR Screen Page</Text>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={openCamera}>
                <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={targetLanguage}
                    style={styles.picker}
                    onValueChange={(itemValue) => setTargetLanguage(itemValue)}
                >
                    <Picker.Item label="Vietnamese" value="vi" />
                    <Picker.Item label="Spanish" value="es" />
                    <Picker.Item label="French" value="fr" />
                    {/* Add more languages as needed */}
                </Picker>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#1e88e5" />
            ) : translatedText ? (
                <View style={styles.translatedTextBox}>
                    <Text style={styles.translatedText}>{translatedText}</Text>
                </View>
            ) : null}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#1c1c1c',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginVertical: 20,
    },
    button: {
        backgroundColor: '#1e88e5',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: 250,
        height: 250,
        marginVertical: 12,
        borderRadius: 10,
    },
    pickerContainer: {
        backgroundColor: '#333',
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
    },
    picker: {
        height: 50,
        color: '#fff',
    },
    translatedTextBox: {
        backgroundColor: '#2c2c2c',
        borderRadius: 8,
        padding: 20,
        marginVertical: 20,
        width: '80%',
    },
    translatedText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default OCRScreenPage;
