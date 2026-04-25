import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/app/SearchScreen';
import PointDetailScreen from '../screens/app/PointDetailScreen';

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="PointDetail" component={PointDetailScreen} />
    </Stack.Navigator>
  );
}
