import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Colors } from '../constants/colors';

const NAV_LINKS = [
  { label: 'Home', screen: 'Home' },
  { label: 'Ball Catalog', screen: 'BallCatalog' },
  { label: 'Products', screen: 'Shop' },
  { label: 'Driller Booking', screen: 'DrillerBooking' },
];

export default function WebFooter({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 680;

  return (
    <View style={styles.footer}>

      {/* Main footer columns */}
      <View style={[styles.columns, !isWide && styles.columnsStacked]}>

        {/* Brand column */}
        <View style={[styles.col, styles.brandCol]}>
          <Text style={styles.brandName}>🎳 PIN Pro Shop</Text>
          <Text style={styles.brandTagline}>
            Your one-stop bowling equipment shop in Kajang, Selangor.
          </Text>
        </View>

        {/* Quick links */}
        <View style={styles.col}>
          <Text style={styles.colTitle}>Quick Links</Text>
          {NAV_LINKS.map(link => (
            <TouchableOpacity key={link.screen} onPress={() => navigation.navigate(link.screen)}>
              <Text style={styles.colLink}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.col}>
          <Text style={styles.colTitle}>Contact Us</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://maps.app.goo.gl/iLaxeELBj87rZiW27')}>
            <Text style={styles.colLink}>
              📍 Lot 3-1 Jalan Jelok & Kompleks Metro Point,{'\n'}Bandar Kajang 43000 Selangor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            Clipboard.setString('+601112261274');
            alert('Phone number copied!');
          }}>
            <Text style={styles.colLink}>📞 +60 11-1226 1274</Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>© 2025 PIN Pro Shop. All rights reserved.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.adminLink}>Admin Login</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 40,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 24,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    gap: 32,
    flexWrap: 'wrap',
  },
  columnsStacked: {
    flexDirection: 'column',
  },
  col: {
    flex: 1,
    minWidth: 180,
    gap: 10,
  },
  brandCol: {
    flex: 1.2,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 20,
  },
  colTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  colLink: {
    fontSize: 13,
    color: Colors.muted,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  copyright: {
    fontSize: 12,
    color: Colors.muted,
  },
  adminLink: {
    fontSize: 12,
    color: Colors.muted,
    textDecorationLine: 'underline',
  },
});
