import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, useWindowDimensions
} from 'react-native';
import { Image } from 'expo-image';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Colors } from '../constants/colors';

export default function BallCatalogScreen({ navigation }) {
  const [balls, setBalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  // Responsive columns based on screen width
  const getNumColumns = () => {
    if (width >= 1440) return 5;
    if (width >= 1200) return 4;
    if (width >= 800) return 3;
    return 2;
  };

  const numColumns = getNumColumns();
  const GAP = 16;
  const PADDING = 16;
  const cardWidth = (width - PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

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
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={styles.loadingText}>Loading catalog...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={balls}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.list}
        columnWrapperStyle={numColumns > 1 ? { gap: GAP } : null}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { width: cardWidth }]}
            onPress={() => navigation.navigate('BallDetail', { ball: item })}
            activeOpacity={0.85}
          >
            {/* Image */}
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

              {/* Availability Badge */}
              <View style={[
                styles.badge,
                { backgroundColor: item.available ? Colors.primary : '#7a3020' }
              ]}>
                <Text style={styles.badgeText}>
                  {item.available ? 'Available' : 'Unavailable'}
                </Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.cardBody}>
              <Text style={styles.ballName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.ballBrand} numberOfLines={1}>{item.brand}</Text>

              <View style={styles.specRow}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>coverstock</Text>
                  <Text style={styles.specValue}>{item.coverstock}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Core type</Text>
                  <Text style={styles.specValue}>{item.symmetrical ? 'Symmetrical' : 'Asymmetrical'}</Text>
                </View>
              </View>

              <Text style={styles.viewMore}>Tap to view specs →</Text>
            </View>
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
    aspectRatio: 1,
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
    fontSize: 48,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  ballName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  ballBrand: {
    fontSize: 12,
    color: Colors.muted,
  },
  specRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  specItem: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specLabel: {
    fontSize: 10,
    color: Colors.muted,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  viewMore: {
    fontSize: 12,
    color: Colors.secondary,
    textAlign: 'right',
    marginTop: 2,
  },
});