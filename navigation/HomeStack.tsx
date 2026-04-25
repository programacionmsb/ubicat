import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/app/HomeScreen';
import InstitutionDetailScreen from '../screens/app/InstitutionDetailScreen';
import BuildingDetailScreen from '../screens/app/BuildingDetailScreen';
import PointDetailScreen from '../screens/app/PointDetailScreen';
import CampusMapScreen from '../screens/app/CampusMapScreen';
import FloorPlanScreen from '../screens/app/FloorPlanScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="InstitutionDetail" component={InstitutionDetailScreen} />
      <Stack.Screen name="BuildingDetail" component={BuildingDetailScreen} />
      <Stack.Screen name="PointDetail" component={PointDetailScreen} />
      <Stack.Screen name="CampusMap" component={CampusMapScreen} />
      <Stack.Screen name="FloorPlan" component={FloorPlanScreen} />
    </Stack.Navigator>
  );
}
