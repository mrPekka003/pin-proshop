import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../constants/colors';

export default function CartScreen({ route, navigation }) {
  const { cart: initialCart } = route.params || { cart: [] };
  const [cart, setCart] = useState(initialCart);

  const increaseQty = (id) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseQty = (id) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Go back and add some items!</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.backButtonText}>Back to Shop</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Item Image */}
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.itemImage}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={{ fontSize: 30 }}>🛍️</Text>
                </View>
              )}
            </View>

            {/* Item Info */}
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>RM {item.price}</Text>

              {/* Qty Controls */}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => decreaseQty(item.id)}
                >
                  <Text style={styles.qtyButtonText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseQty(item.id)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Subtotal */}
            <Text style={styles.subtotal}>
              RM {(item.price * item.qty).toFixed(2)}
            </Text>

          </View>
        )}
      />

      {/* Order Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            {cart.reduce((sum, i) => sum + i.qty, 0)} item(s)
          </Text>
          <Text style={styles.summaryValue}>RM {getTotal()}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            alert(`Order placed!\nTotal: RM ${getTotal()}\nThank you for shopping with PIN Pro Shop!`)
          }
        >
          <Text style={styles.checkoutButtonText}>
            Checkout — RM {getTotal()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Shop')}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
    backgroundColor: Colors.background,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.muted,
  },
  backButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
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
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  itemPrice: {
    fontSize: 13,
    color: Colors.muted,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyButtonText: {
    fontSize: 18,
    color: Colors.secondary,
    fontWeight: 'bold',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.secondary,
    alignSelf: 'flex-start',
  },
  summary: {
    backgroundColor: Colors.card,
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.muted,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  continueButtonText: {
    color: Colors.muted,
    fontSize: 15,
  },
});