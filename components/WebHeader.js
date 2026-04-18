import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Colors } from '../constants/colors';

const NAV_LINKS = [
  { label: 'Home', screen: 'Home' },
  { label: 'Ball Catalog', screen: 'BallCatalog' },
  { label: 'Products', screen: 'Shop' },
  { label: 'Driller Booking', screen: 'DrillerBooking' },
];

// Maps sub-screens back to their parent nav item
const ACTIVE_MAP = {
  BallDetail: 'BallCatalog',
};

export default function WebHeader({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 680;

  const state = navigation.getState();
  const currentRoute = state.routes[state.index].name;
  const activeScreen = ACTIVE_MAP[currentRoute] ?? currentRoute;

  return (
    <View style={styles.header}>
      <View style={styles.inner}>
        {/* Logo */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.logo}>🎳 PIN Pro Shop</Text>
        </TouchableOpacity>

        {/* Nav links — shown on wider screens */}
        {isWide ? (
          <View style={styles.nav}>
            {NAV_LINKS.map(link => (
              <TouchableOpacity
                key={link.screen}
                onPress={() => navigation.navigate(link.screen)}
                style={styles.navLinkWrap}
              >
                <Text style={[styles.navLink, activeScreen === link.screen && styles.navLinkActive]}>
                  {link.label}
                </Text>
                {activeScreen === link.screen && <View style={styles.navUnderline} />}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Compact row on narrow screens
          <View style={styles.navCompact}>
            {NAV_LINKS.map(link => (
              <TouchableOpacity
                key={link.screen}
                onPress={() => navigation.navigate(link.screen)}
              >
                <Text style={[styles.navLinkSmall, activeScreen === link.screen && styles.navLinkActive]}>
                  {link.label === 'Ball Catalog' ? 'Catalog' :
                   link.label === 'Driller Booking' ? 'Book' : link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 100,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
    letterSpacing: 0.3,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navLinkWrap: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  navLink: {
    fontSize: 14,
    color: Colors.muted,
    fontWeight: '500',
  },
  navLinkActive: {
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  navUnderline: {
    height: 2,
    backgroundColor: Colors.secondary,
    borderRadius: 2,
    width: '100%',
    marginTop: 2,
  },
  navCompact: {
    flexDirection: 'row',
    gap: 12,
  },
  navLinkSmall: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: '500',
  },
});
