import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/app/HomeScreen';
import InstitutionDetailScreen from '../screens/app/InstitutionDetailScreen';
import BuildingDetailScreen from '../screens/app/BuildingDetailScreen';
import PointDetailScreen from '../screens/app/PointDetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="InstitutionDetail" component={InstitutionDetailScreen} />
      <Stack.Screen name="BuildingDetail" component={BuildingDetailScreen} />
      <Stack.Screen name="PointDetail" component={PointDetailScreen} />
    </Stack.Navigator>
  );
}
