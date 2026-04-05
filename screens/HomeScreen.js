import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '../constants/colors';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={require('../assets/pin-pro-shop-1.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <Text style={styles.heroTitle}>🎳 PIN Pro Shop</Text>
        <Text style={styles.heroSubtitle}>Your one-stop bowling equipment shop</Text>
      </View>

      {/* Menu Buttons */}
      <View style={styles.menuGrid}>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate('BallCatalog')}
        >
          <Text style={styles.cardIcon}>🎳</Text>
          <Text style={styles.cardTitle}>Ball Catalog</Text>
          <Text style={styles.cardDesc}>Browse our bowling balls</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.cardIcon}>🛍️</Text>
          <Text style={styles.cardTitle}>Products</Text>
          <Text style={styles.cardDesc}>Browse our equipment & accessories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: Colors.primary }]}
          onPress={() => navigation.navigate('DrillerBooking')}
        >
          <Text style={styles.cardIcon}>🔧</Text>
          <Text style={styles.cardTitle}>Driller Booking</Text>
          <Text style={styles.cardDesc}>Book an appointment with our driller</Text>
        </TouchableOpacity>

      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>📍 Lot 3-1 Jalan Jelok & Kompleks Metro Point, Bandar Kajang 43000 Selangor.</Text>
        <Text style={styles.footerText}>📞 +60 11 1226 1274</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.adminLink}
        >
          <Text style={styles.adminLinkText}>Admin Login</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.2,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: 160,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: Colors.accent,
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  adminLink: {
    marginTop: 12,
    paddingVertical: 8,
  },
  adminLinkText: {
    fontSize: 13,
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
});