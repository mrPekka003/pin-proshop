import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Colors } from '../constants/colors';

export default function AdminDashboardScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>🛠️ Admin Dashboard</Text>
        <Text style={styles.subtitle}>PIN Pro Shop Management</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catalog</Text>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('AdminBalls')}
        >
          <Text style={styles.menuIcon}>🎳</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Bowling Balls</Text>
            <Text style={styles.menuDesc}>Add, edit or delete bowling balls</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('AdminShop')}
        >
          <Text style={styles.menuIcon}>🛍️</Text>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>Shop Items</Text>
            <Text style={styles.menuDesc}>Add, edit or delete shop items</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: Colors.card,
    padding: 24,
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
  },
  section: {
    margin: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: {
    fontSize: 28,
  },
  menuInfo: {
    flex: 1,
    gap: 3,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  menuDesc: {
    fontSize: 13,
    color: Colors.muted,
  },
  menuArrow: {
    fontSize: 18,
    color: Colors.secondary,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 15,
  },
});