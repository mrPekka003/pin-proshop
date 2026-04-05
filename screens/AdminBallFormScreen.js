import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, Switch, ActivityIndicator
} from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Colors } from '../constants/colors';

export default function AdminBallFormScreen({ route, navigation }) {
  const existing = route.params?.ball;

  const [name, setName] = useState(existing?.name ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [weight, setWeight] = useState(existing?.weight?.toString() ?? '');
  const [coverstock, setCoverstock] = useState(existing?.coverstock ?? '');
  const [color, setColor] = useState(existing?.color ?? '');
  const [core, setCore] = useState(existing?.core ?? '');
  const [finish, setFinish] = useState(existing?.finish ?? '');
  const [rg, setRg] = useState(existing?.rg?.toString() ?? '');
  const [diff, setDiff] = useState(existing?.diff?.toString() ?? '');
  const [price, setPrice] = useState(existing?.price?.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');
  const [available, setAvailable] = useState(existing?.available ?? true);
  const [symmetrical, setSymmetrical] = useState(existing?.symmetrical ?? true);
  const [loading, setLoading] = useState(false);

  const isEditing = !!existing;

  const handleSave = async () => {
    if (!name || !brand || !weight || !price) {
      Alert.alert('Missing Info', 'Name, brand, weight and price are required.');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name,
        brand,
        weight: parseFloat(weight),
        coverstock,
        color,
        core,
        finish,
        rg: parseFloat(rg) || null,
        diff: parseFloat(diff) || null,
        price: parseFloat(price),
        imageUrl,
        available,
        symmetrical,
      };

      if (isEditing) {
        await updateDoc(doc(db, 'bowlingBalls', existing.id), data);
        Alert.alert('Updated!', `${name} has been updated.`);
      } else {
        data.createdAt = Timestamp.now();
        await addDoc(collection(db, 'bowlingBalls'), data);
        Alert.alert('Added!', `${name} has been added to the catalog.`);
      }

      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, value, onChangeText, placeholder, keyboardType }) => (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ''}
        placeholderTextColor={Colors.muted}
        keyboardType={keyboardType ?? 'default'}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Info</Text>
        <Field label="Ball Name *" value={name} onChangeText={setName} placeholder="e.g. Phaze II" />
        <Field label="Brand *" value={brand} onChangeText={setBrand} placeholder="e.g. Storm" />
        <Field label="Weight (lbs) *" value={weight} onChangeText={setWeight} placeholder="e.g. 15" keyboardType="numeric" />
        <Field label="Price (RM) *" value={price} onChangeText={setPrice} placeholder="e.g. 995" keyboardType="numeric" />
        <Field label="Image URL" value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        <Field label="Coverstock" value={coverstock} onChangeText={setCoverstock} placeholder="e.g. Hybrid Reactive" />
        <Field label="Color" value={color} onChangeText={setColor} placeholder="e.g. Blue/Silver" />
        <Field label="Core" value={core} onChangeText={setCore} placeholder="e.g. Velocity Core" />
        <Field label="Finish" value={finish} onChangeText={setFinish} placeholder="e.g. 3000 Grit Abralon" />
        <Field label="RG" value={rg} onChangeText={setRg} placeholder="e.g. 2.48" keyboardType="numeric" />
        <Field label="Differential" value={diff} onChangeText={setDiff} placeholder="e.g. 0.051" keyboardType="numeric" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Available</Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.accent}
          />
        </View>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Symmetrical Core</Text>
          <Switch
            value={symmetrical}
            onValueChange={setSymmetrical}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.accent}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={Colors.accent} />
          : <Text style={styles.saveButtonText}>
              {isEditing ? 'Save Changes' : 'Add Ball'}
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 14,
    color: Colors.accent,
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