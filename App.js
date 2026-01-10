import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import GetStartedScreen from './components/SignUpProcess/GetStarted';
import PersonalInformationScreen from './components/SignUpProcess/PersonalInformation';
import Transfer from './components/Services/Transfer';
import ClaimReceive from './components/Services/Receive/ClaimReceive';
import LinkReceive from './components/Services/Receive/LinkReceive';
import LogIn from './components/LogIn';
import CreateAccount from './components/SignUpProcess/CreateAccount';
import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import History from './components/Services/History';
import Support from './components/Services/Support';
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import Intro from './components/Intro';
import FileStorage from './assets/FileStorage';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    FileStorage.initialize();
  }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={Intro} /> 
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="Login" component={LogIn} />
        <Stack.Screen name="ClaimReceive" component={ClaimReceive} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="Transfer" component={Transfer} />
        <Stack.Screen name="LinkReceive" component={LinkReceive} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;