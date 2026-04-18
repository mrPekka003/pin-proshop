import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert
} from 'react-native';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Colors } from '../constants/colors';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM',
];

const DRILLING_SERVICES = [
  { id: 'conventional', label: 'Conventional Grip', desc: 'Standard finger insertion' },
  { id: 'fingertip', label: 'Fingertip Grip', desc: 'Enhanced ball control' },
  { id: 'slug', label: 'Thumb Slug Insert', desc: 'Thumb hole reinforcement' },
  { id: 'relayout', label: 'Re-layout & Redrill', desc: 'Change existing drilling' },
  { id: 'plugfill', label: 'Plug & Fill', desc: 'Fill existing holes' },
];

export default function DrillerBookingScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  if (!name || !phone || !selectedDate || !selectedTime || !selectedService) {
    Alert.alert('Missing Info', 'Please fill in all fields before submitting.');
    return;
  }

  setLoading(true);
  try {
    // Save the booking
    const bookingRef = await addDoc(collection(db, 'drillerBookings'), {
      name,
      phone,
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
      notes,
      status: 'pending',
      createdAt: Timestamp.now(),
    });

    // Trigger email to admin
    await addDoc(collection(db, 'mail'), {
      to: 'pinproshop@gmail.com',
      message: {
        subject: `New Driller Booking — ${name}`,
        html: `
          <h2>New Driller Booking Received</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Service</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${selectedService}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${selectedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${selectedTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Notes</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${notes || 'None'}</td>
            </tr>
          </table>
          <p style="color: #666; margin-top: 16px;">
            Booking ID: ${bookingRef.id}
          </p>
        `,
      },
    });

    Alert.alert(
      'Booking Confirmed! 🔧',
      `Name: ${name}\nService: ${selectedService}\nDate: ${selectedDate}\nTime: ${selectedTime}`,
    );

    setName('');
    setPhone('');
    setNotes('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');

  } catch (error) {
    Alert.alert('Error', 'Something went wrong. Please try again.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.root}>
      <WebHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>

      {/* Header Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>🔧 Book a Driller</Text>
        <Text style={styles.bannerSubtitle}>
          Our professional driller will help fit your ball perfectly
        </Text>
      </View>

      {/* Personal Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Details</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ahmad bin Ali"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 012-3456789"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      {/* Drilling Service */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Service</Text>
        <View style={styles.serviceList}>
          {DRILLING_SERVICES.map(service => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.label && styles.serviceCardSelected
              ]}
              onPress={() => setSelectedService(service.label)}
            >
              <View style={styles.serviceInfo}>
                <Text style={[
                  styles.serviceLabel,
                  selectedService === service.label && styles.serviceLabelSelected
                ]}>
                  {service.label}
                </Text>
                <Text style={[
                  styles.serviceDesc,
                  selectedService === service.label && styles.serviceDescSelected
                ]}>
                  {service.desc}
                </Text>
              </View>
              <View style={[
                styles.radioOuter,
                selectedService === service.label && styles.radioOuterSelected
              ]}>
                {selectedService === service.label && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD  e.g. 2026-04-01"
          value={selectedDate}
          onChangeText={setSelectedDate}
        />
      </View>

      {/* Time Slots */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
        <View style={styles.slotGrid}>
          {TIME_SLOTS.map(slot => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.slot,
                selectedTime === slot && styles.slotSelected
              ]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text style={[
                styles.slotText,
                selectedTime === slot && styles.slotTextSelected
              ]}>
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Ball model, span measurement, grip preference..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Booking Summary */}
      {(selectedService || selectedDate || selectedTime) && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          {selectedService ? <Text style={styles.summaryText}>🔧 {selectedService}</Text> : null}
          {selectedDate ? <Text style={styles.summaryText}>📅 {selectedDate}</Text> : null}
          {selectedTime ? <Text style={styles.summaryText}>🕐 {selectedTime}</Text> : null}
        </View>
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Submitting...' : 'Confirm Booking'}
        </Text>
      </TouchableOpacity>

      <WebFooter navigation={navigation} />
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    gap: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: Colors.card,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
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
  serviceList: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  serviceCardSelected: {
    backgroundColor: Colors.card,
    borderColor: Colors.primary,
  },
  serviceInfo: {
    flex: 1,
    gap: 3,
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.muted,
  },
  serviceLabelSelected: {
    color: Colors.accent,
  },
  serviceDesc: {
    fontSize: 12,
    color: Colors.muted,
    opacity: 0.7,
  },
  serviceDescSelected: {
    color: Colors.secondary,
    opacity: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotText: {
    fontSize: 13,
    color: Colors.muted,
  },
  slotTextSelected: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginHorizontal: 16,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.accent,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
});