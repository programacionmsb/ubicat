import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FavoritesScreen from '../screens/app/FavoritesScreen';
import PointDetailScreen from '../screens/app/PointDetailScreen';

const Stack = createNativeStackNavigator();

export default function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesMain" component={FavoritesScreen} />
      <Stack.Screen name="PointDetail" component={PointDetailScreen} />
    </Stack.Navigator>
  );
}
