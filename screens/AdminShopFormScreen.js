import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Colors } from '../constants/colors';

export default function AdminShopFormScreen({ route, navigation }) {
  const existing = route.params?.item;

  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [price, setPrice] = useState(existing?.price?.toString() ?? '');
  const [stock, setStock] = useState(existing?.stock?.toString() ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');
  const [loading, setLoading] = useState(false);

  const isEditing = !!existing;

  const handleSave = async () => {
    if (!name || !category || !price || !stock) {
      Alert.alert('Missing Info', 'Name, category, price and stock are required.');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        imageUrl,
      };

      if (isEditing) {
        await updateDoc(doc(db, 'shopItems', existing.id), data);
        Alert.alert('Updated!', `${name} has been updated.`);
      } else {
        data.createdAt = Timestamp.now();
        await addDoc(collection(db, 'shopItems'), data);
        Alert.alert('Added!', `${name} has been added to the shop.`);
      }

      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, value, onChangeText, placeholder, keyboardType, multiline }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ''}
        placeholderTextColor={Colors.muted}
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Item Info</Text>
        <Field label="Item Name *" value={name} onChangeText={setName} placeholder="e.g. Storm Bowling Bag" />
        <Field label="Category *" value={category} onChangeText={setCategory} placeholder="e.g. Bags, Shoes, Accessories" />
        <Field label="Price (RM) *" value={price} onChangeText={setPrice} placeholder="e.g. 150" keyboardType="numeric" />
        <Field label="Stock *" value={stock} onChangeText={setStock} placeholder="e.g. 10" keyboardType="numeric" />
        <Field label="Image URL" value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
        <Field label="Description" value={description} onChangeText={setDescription} placeholder="Short description of the item..." multiline />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={Colors.accent} />
          : <Text style={styles.saveButtonText}>
              {isEditing ? 'Save Changes' : 'Add Item'}
            </Text>
        }
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: Colors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.accent,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});