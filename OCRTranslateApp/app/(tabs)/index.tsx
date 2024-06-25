import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Page</Text>
            <Link href="/translator" style={styles.link}>
                Go to Translator Page
            </Link>
            <Link href="/ocr" style={styles.link}>
                Go to OCR Page
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    link: {
        fontSize: 18,
        color: "blue",
        marginVertical: 10,
    },
});
