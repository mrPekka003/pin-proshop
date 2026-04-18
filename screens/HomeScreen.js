import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors } from '../constants/colors';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <WebHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.container}>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={require('../assets/pin-pro-shop-1.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>PIN Pro Shop</Text>
            <Text style={styles.heroSubtitle}>Your one-stop bowling equipment shop in Kajang, Selangor</Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => navigation.navigate('BallCatalog')}
            >
              <Text style={styles.heroButtonText}>Browse Ball Catalog →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <View style={styles.menuGrid}>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('BallCatalog')}
              activeOpacity={0.85}
            >
              <Text style={styles.cardIcon}>🎳</Text>
              <Text style={styles.cardTitle}>Ball Catalog</Text>
              <Text style={styles.cardDesc}>Browse our full range of bowling balls by brand, category, and performance level.</Text>
              <Text style={styles.cardCta}>View Catalog →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Shop')}
              activeOpacity={0.85}
            >
              <Text style={styles.cardIcon}>🛍️</Text>
              <Text style={styles.cardTitle}>Products</Text>
              <Text style={styles.cardDesc}>Shoes, bags, accessories, and everything you need on the lanes.</Text>
              <Text style={styles.cardCta}>Shop Now →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('DrillerBooking')}
              activeOpacity={0.85}
            >
              <Text style={styles.cardIcon}>🔧</Text>
              <Text style={styles.cardTitle}>Driller Booking</Text>
              <Text style={styles.cardDesc}>Book an appointment with our professional driller for a perfect fit.</Text>
              <Text style={styles.cardCta}>Book Now →</Text>
            </TouchableOpacity>

          </View>
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
  },
  hero: {
    height: 420,
    justifyContent: 'center',
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
    opacity: 0.25,
  },
  heroOverlay: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    maxWidth: 480,
    lineHeight: 24,
  },
  heroButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  heroButtonText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 24,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 220,
    flex: 1,
    maxWidth: 340,
    gap: 8,
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 20,
    flex: 1,
  },
  cardCta: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginTop: 8,
  },
});
