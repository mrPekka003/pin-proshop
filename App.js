import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import BallCatalogScreen from './screens/BallCatalogScreen';
import BallDetailScreen from './screens/BallDetailScreen';
import ShopScreen from './screens/ShopScreen';
import DrillerBookingScreen from './screens/DrillerBookingScreen';
import LoginScreen from './screens/LoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { Colors } from './constants/colors';
import AdminBallsScreen from './screens/AdminBallsScreen';
import AdminShopScreen from './screens/AdminShopScreen';
import AdminBallFormScreen from './screens/AdminBallFormScreen';
import AdminShopFormScreen from './screens/AdminShopFormScreen';

// Inside Stack.Navigator, add these:


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: Colors.card },
          headerTintColor: Colors.accent,
          headerTitleStyle: { fontWeight: 'bold' },
        }}      
      >
        <Stack.Screen name="AdminBalls" component={AdminBallsScreen} options={{ title: 'Manage Balls' }}/>
        <Stack.Screen name="AdminShop" component={AdminShopScreen} options={{ title: 'Manage Shop Items' }}/>
        <Stack.Screen name="AdminBallForm" component={AdminBallFormScreen} options={{ title: 'Ball Details' }}/>
        <Stack.Screen name="AdminShopForm" component={AdminShopFormScreen} options={{ title: 'Shop Item Details' }}/>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="BallCatalog" component={BallCatalogScreen} />
        <Stack.Screen name="BallDetail" component={BallDetailScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} options={{ title: 'Products' }} />
        <Stack.Screen name="DrillerBooking" component={DrillerBookingScreen} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ headerBackVisible: false, title: 'Admin Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//just some test notes here