import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Colors } from '../constants/colors';

export default function ShopScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

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
        console.error('Error fetching shop items:', error);
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

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a3c6e" />
        <Text style={styles.loadingText}>Loading shop...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Cart Button */}
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartBar}
          onPress={() => navigation.navigate('Cart', { cart })}
        >
          <Text style={styles.cartBarText}>
            🛒 {getCartCount()} item{getCartCount() > 1 ? 's' : ''} in cart
          </Text>
          <Text style={styles.cartBarAction}>View Cart →</Text>
        </TouchableOpacity>
      )}

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

              <TouchableOpacity
                style={[
                  styles.addButton,
                  item.stock === 0 && styles.addButtonDisabled
                ]}
                onPress={() => addToCart(item)}
                disabled={item.stock === 0}
              >
                <Text style={styles.addButtonText}>
                  {item.stock === 0 ? 'Unavailable' : '+ Add to Cart'}
                </Text>
              </TouchableOpacity>
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
  cartBar: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  cartBarText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cartBarAction: {
    color: Colors.accent,
    fontSize: 14,
    opacity: 0.8,
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
    marginTop: 4,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: Colors.border,
  },
  addButtonText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: 'bold',
  },
});