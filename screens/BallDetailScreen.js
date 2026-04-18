import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/colors';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

export default function BallDetailScreen({ route, navigation }) {
  const { ball } = route.params;

  const specs = [
    { label: 'Weight', value: `${ball.weight} lbs` },
    { label: 'Coverstock', value: ball.coverstock ?? 'N/A' },
    { label: 'Color', value: ball.color ?? 'N/A' },
    { label: 'Core', value: ball.core ?? 'N/A' },
    { label: 'Finish', value: ball.finish ?? 'N/A' },
    { label: 'RG', value: ball.rg ?? 'N/A' },
    { label: 'Diff', value: ball.diff ?? 'N/A' },
    { label: 'Symmetry', value: ball.symmetrical ? 'Symmetrical' : 'Asymmetrical' },
    { label: 'Release', value: ball.release?.toDate?.().getFullYear?.() ?? 'N/A' },
  ];

  return (
    <View style={styles.root}>
      <WebHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>

      {/* Top Section — Image + Info side by side */}
      <View style={styles.topSection}>
        <View style={styles.imageContainer}>
          {ball.imageUrl ? (
            <Image
              source={{ uri: ball.imageUrl }}
              style={styles.ballImage}
              contentFit="contain"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ fontSize: 48 }}>🎳</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.ballName}>{ball.name}</Text>
          <Text style={styles.ballBrand}>{ball.brand}</Text>
          <Text style={styles.priceValue}>RM {ball.price}</Text>
          <View style={[
            styles.badge,
            { backgroundColor: ball.available ? '#2d6a4f' : '#b5451b' }
          ]}>
            <Text style={styles.badgeText}>
              {ball.available ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </View>

      {/* Specs Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        {specs.map((spec, index) => (
          <View
            key={spec.label}
            style={[styles.specRow, index % 2 === 0 && styles.specRowAlt]}
          >
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {ball.available && (
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.buyButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('DrillerBooking')}
        >
          <Text style={styles.bookButtonText}>Book a Driller</Text>
        </TouchableOpacity>
      </View>

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
    paddingBottom: 40,
  },
  topSection: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: 16,
    gap: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  imageContainer: {
    width: 130,
    height: 130,
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ballImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  ballName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  ballBrand: {
    fontSize: 14,
    color: Colors.muted,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: Colors.card,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  specRowAlt: {
    backgroundColor: Colors.background,
  },
  specLabel: {
    fontSize: 13,
    color: Colors.muted,
  },
  specValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.accent,
    textAlign: 'right',
    flex: 1,
    paddingLeft: 16,
  },
  actions: {
    paddingHorizontal: 16,
    gap: 10,
  },
  buyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  bookButtonText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});