import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Colors } from '../constants/colors';

export default function BallCatalogScreen({ navigation }) {
  const [balls, setBalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalls = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'bowlingBalls'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBalls(data);
      } catch (error) {
        console.error('Error fetching balls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalls();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a3c6e" />
        <Text style={styles.loadingText}>Loading catalog...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={balls}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BallDetail', { ball: item })}
          >
            {/* Ball Image */}
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.ballImage}
                  contentFit="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>🎳</Text>
                </View>
              )}

              {/* Availability Badge overlaid on image */}
              <View style={[
                styles.badge,
                { backgroundColor: item.available ? '#2d6a4f' : '#b5451b' }
              ]}>
                <Text style={styles.badgeText}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Text>
              </View>
            </View>

            {/* Ball Info */}
            <Text style={styles.ballName}>{item.name}</Text>
            <Text style={styles.ballBrand}>{item.brand}</Text>

            <View style={styles.specRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Weight</Text>
                <Text style={styles.specValue}>{item.weight} lbs</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Coverstock</Text>
                <Text style={styles.specValue}>{item.coverstock}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Price</Text>
                <Text style={styles.specValue}>RM {item.price}</Text>
              </View>
            </View>

            <Text style={styles.viewMore}>Tap to view full specs →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.accent,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background,
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
  imagePlaceholderText: {
    fontSize: 64,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: 'bold',
  },
  ballName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  ballBrand: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  specRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  specItem: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specLabel: {
    fontSize: 11,
    color: Colors.muted,
    marginBottom: 4,
  },
  specValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  viewMore: {
    fontSize: 13,
    color: Colors.secondary,
    textAlign: 'right',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});