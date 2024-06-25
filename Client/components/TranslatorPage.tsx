import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const TranslatorPage: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [targetLanguage, setTargetLanguage] = useState<string>('vi');
    const [translatedText, setTranslatedText] = useState<string>('');

    const handleTranslate = () => {
        axios.post('http://10.106.21.33:5000/translate', { text, targetLanguage })
            .then(response => {
                setTranslatedText(response.data.translatedText);
            })
            .catch(error => {
                console.error('Error translating text:', error);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter text to translate"
                placeholderTextColor="#888"
                value={text}
                onChangeText={setText}
            />
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
            <TouchableOpacity style={styles.button} onPress={handleTranslate}>
                <Text style={styles.buttonText}>Translate</Text>
            </TouchableOpacity>
            {translatedText ? <Text style={styles.result}>{translatedText}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    input: {
        height: 40,
        borderColor: '#888',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        color: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#fff',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#1e88e5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    result: {
        marginTop: 16,
        fontSize: 16,
        color: '#fff',
    },
});

export default TranslatorPage;
