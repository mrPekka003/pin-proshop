import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Alert, Switch, ActivityIndicator
} from 'react-native';
import { db } from '../config/firebase';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { Colors } from '../constants/colors';

// Defined outside to prevent remount on every keystroke (fixes focus loss)
function Field({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
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
}

const CATEGORIES = ['High Performance', 'Mid Performance', 'Entry Level', 'Urethane', 'Plastic / Spare'];

export default function AdminBallFormScreen({ route, navigation }) {
  const existing = route.params?.ball;

  const [docId, setDocId] = useState('');
  const [name, setName] = useState(existing?.name ?? '');
  const [brand, setBrand] = useState(existing?.brand ?? '');
  const [coverstock, setCoverstock] = useState(existing?.coverstock ?? '');
  const [color, setColor] = useState(existing?.color ?? '');
  const [core, setCore] = useState(existing?.core ?? '');
  const [finish, setFinish] = useState(existing?.finish ?? '');
  const [rg, setRg] = useState(existing?.rg?.toString() ?? '');
  const [diff, setDiff] = useState(existing?.diff?.toString() ?? '');
  const [intDiff, setIntDiff] = useState(existing?.intDiff?.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');
  const [available, setAvailable] = useState(existing?.available ?? true);
  const [symmetrical, setSymmetrical] = useState(existing?.symmetrical ?? true);
  const [releaseDate, setReleaseDate] = useState(existing?.releaseDate ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [loading, setLoading] = useState(false);

  const isEditing = !!existing;

  const handleSave = async () => {
    if (!name || !brand) {
      Alert.alert('Missing Info', 'Name and brand are required.');
      return;
    }
    if (!isEditing && !docId.trim()) {
      Alert.alert('Missing Info', 'Document ID is required.');
      return;
    }

    setLoading(true);
    try {
      const data = {
        name, brand,
        coverstock, color, core, finish,
        rg: parseFloat(rg) || null,
        diff: parseFloat(diff) || null,
        intDiff: !symmetrical ? (parseFloat(intDiff) || null) : null,
        imageUrl, available, symmetrical,
        releaseDate,
        category,
      };

      if (isEditing) {
        await updateDoc(doc(db, 'bowlingBalls', existing.id), data);
        Alert.alert('Updated!', `${name} has been updated.`);
      } else {
        data.createdAt = Timestamp.now();
        await setDoc(doc(db, 'bowlingBalls', docId.trim()), data);
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

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Two-column layout */}
      <View style={styles.row}>

        {/* Left: Basic Info */}
        <View style={[styles.section, styles.col]}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          {!isEditing && (
            <Field label="Document ID *" value={docId} onChangeText={setDocId} placeholder="use CamelCase format, e.g. phaze2Pearl" />
          )}
          <Field label="Ball Name *" value={name} onChangeText={setName} placeholder="e.g. Phaze 2" />
          <Field label="Brand *" value={brand} onChangeText={setBrand} placeholder="e.g. Storm" />
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Release Date</Text>
            <TextInput
              style={styles.input}
              value={releaseDate}
              onChangeText={v => {
                const digits = v.replace(/\D/g, '').slice(0, 8);
                let formatted = digits;
                if (digits.length > 4) formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`;
                else if (digits.length > 2) formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
                setReleaseDate(formatted);
              }}
              placeholder="DD-MM-YYYY"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipSelected]}
                  onPress={() => setCategory(prev => prev === cat ? '' : cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Field label="Image URL" value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." />
        </View>

        {/* Right: Specifications */}
        <View style={[styles.section, styles.col]}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          <Field label="Coverstock" value={coverstock} onChangeText={setCoverstock} placeholder="e.g. Hybrid Reactive" />
          <Field label="Color" value={color} onChangeText={setColor} placeholder="e.g. Blue/Silver" />
          <Field label="Core" value={core} onChangeText={setCore} placeholder="e.g. Velocity Core" />
          <Field label="Finish" value={finish} onChangeText={setFinish} placeholder="e.g. 3000 Grit Abralon" />
          <View style={styles.twoCol}>
            <View style={styles.halfField}>
              <Field label="RG" value={rg} onChangeText={setRg} placeholder="2.48" keyboardType="numeric" />
            </View>
            <View style={styles.halfField}>
              <Field label="Differential" value={diff} onChangeText={setDiff} placeholder="0.051" keyboardType="numeric" />
            </View>
          </View>
          {!symmetrical && (
            <Field label="Int. Differential (PSA)" value={intDiff} onChangeText={setIntDiff} placeholder="0.018" keyboardType="numeric" />
          )}
        </View>

      </View>

      {/* Bottom: Status + Save */}
      <View style={styles.bottomRow}>
        <View style={styles.togglesSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.toggles}>
            <View style={styles.toggleItem}>
              <Switch
                value={available}
                onValueChange={setAvailable}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.accent}
              />
              <Text style={styles.toggleLabel}>Available</Text>
            </View>
            <View style={styles.toggleItem}>
              <Switch
                value={symmetrical}
                onValueChange={setSymmetrical}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.accent}
              />
              <Text style={styles.toggleLabel}>Symmetrical Core</Text>
            </View>
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
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  col: {
    flex: 1,
    minWidth: 280,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.accent,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  halfField: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  togglesSection: {
    flex: 1,
    minWidth: 200,
    gap: 8,
  },
  toggles: {
    flexDirection: 'row',
    gap: 20,
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 13,
    color: Colors.accent,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: Colors.muted,
  },
  chipTextSelected: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  saveButtonText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
