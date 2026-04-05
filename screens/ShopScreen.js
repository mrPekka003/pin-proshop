import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Colors } from '../constants/colors';

export default function ShopScreen() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'shopItems'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
        setFiltered(data);
        const cats = ['All', ...new Set(data.map(item => item.category).filter(Boolean))];
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFiltered(items);
    } else {
      setFiltered(items.filter(item => item.category === category));
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === item && styles.filterChipSelected
              ]}
              onPress={() => filterByCategory(item)}
            >
              <Text style={[
                styles.filterChipText,
                selectedCategory === item && styles.filterChipTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Items Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Image */}
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={{ fontSize: 40 }}>🛍️</Text>
                </View>
              )}

              {/* Out of stock overlay */}
              {item.stock === 0 && (
                <View style={styles.outOfStock}>
                  <Text style={styles.outOfStockText}>Out of Stock</Text>
                </View>
              )}
            </View>

            {/* Info */}
            <View style={styles.cardBody}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>RM {item.price}</Text>
              {item.description ? (
                <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
              ) : null}
              <View style={[
                styles.stockBadge,
                { backgroundColor: item.stock > 0 ? Colors.primary : '#7a3020' }
              ]}>
                <Text style={styles.stockBadgeText}>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                </Text>
              </View>
            </View>

          </View>
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
  filterContainer: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    color: Colors.muted,
  },
  filterChipTextSelected: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  grid: {
    padding: 12,
    paddingBottom: 40,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.background,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStock: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    color: Colors.accent,
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardBody: {
    padding: 12,
    gap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  itemCategory: {
    fontSize: 11,
    color: Colors.muted,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginTop: 2,
  },
  itemDesc: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 16,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
  },
  stockBadgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: 'bold',
  },
});