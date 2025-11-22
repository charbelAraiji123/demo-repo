import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform } from 'react-native';
import BottomNav from '../Constants/BottomNav';
import Header from '../Constants/Header';
import FileStorage from '../../assets/FileStorage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const History = ({ navigation, route }) => {
  const [filterType, setFilterType] = useState('all');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const userPhone = route.params?.user?.phoneNumber;
 const user = route.params?.user;
  const loadTransactions = async () => {
  if (!userPhone) return;
  try {
    const allTransfers = await FileStorage.getPendingTransfers();
    // Only transactions where logged-in user is sender or receiver
    const userTransfers = allTransfers
      .filter(t => t.from === userPhone || t.to === userPhone)
      .map(t => ({
        ...t,
        type: t.from === userPhone ? 'Sent' : 'Received',
        date: new Date(t.createdAt),
      }))
      .sort((a, b) => b.date - a.date); // newest first
    setTransactions(userTransfers);
  } catch (err) {
    console.log("Error loading transactions:", err);
  }
};

  useEffect(() => {
    loadTransactions();
    const unsubscribe = navigation.addListener('focus', loadTransactions);
    return unsubscribe;
  }, [userPhone, navigation]);

  const filteredTransactions = transactions.filter(t => {
    let typeMatch = filterType === 'all' || t.type.toLowerCase() === filterType;
    let dateMatch = true;

    if (fromDate) {
      // Compare only date part
      const tDay = new Date(t.date.toDateString());
      const fDay = new Date(fromDate.toDateString());
      dateMatch = dateMatch && tDay >= fDay;
    }
    if (toDate) {
      const tDay = new Date(t.date.toDateString());
      const tDayEnd = new Date(toDate.toDateString());
      tDayEnd.setHours(23,59,59,999);
      dateMatch = dateMatch && tDay <= tDayEnd;
    }

    return typeMatch && dateMatch;
  });

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <Text style={[styles.cell, { flex: 1.2 }]}>{item.type}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.from}</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>{item.to}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{`$${item.amount}`}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.claimed ? 'Claimed' : 'Pending'}</Text>
      <Text style={[styles.cell, { flex: 1.2 }]}>{item.date.toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header text="Transactions History" />

      {/* DATE FILTERS */}
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowFromPicker(true)}>
          <Ionicons name="calendar" size={16} color="#fff" />
          <Text style={styles.dateText}>{fromDate ? fromDate.toLocaleDateString() : 'From Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateBtn} onPress={() => setShowToPicker(true)}>
          <Ionicons name="calendar" size={16} color="#fff" />
          <Text style={styles.dateText}>{toDate ? toDate.toLocaleDateString() : 'To Date'}</Text>
        </TouchableOpacity>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={fromDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowFromPicker(Platform.OS === 'ios'); // iOS stays open
            if (date) setFromDate(date);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => {
            setShowToPicker(Platform.OS === 'ios');
            if (date) setToDate(date);
          }}
        />
      )}

      {/* TYPE FILTERS */}
      <View style={styles.filterRow}>
        {['all', 'sent', 'received'].map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilterType(type)}
            style={[styles.filterBtn, filterType === type && styles.activeFilter]}
          >
            <Text style={[styles.filterText, filterType === type && styles.activeFilterText]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TABLE */}
   <ScrollView horizontal showsHorizontalScrollIndicator={true}>
  <View style={{ flexDirection: 'column' }}>
    {/* HEADER */}
    <View style={[styles.headerRow]}>
      <Text style={[styles.headerCell, { width: 80 }]}>Type</Text>
      <Text style={[styles.headerCell, { width: 150 }]}>From</Text>
      <Text style={[styles.headerCell, { width: 150 }]}>To</Text>
      <Text style={[styles.headerCell, { width: 100 }]}>Amount</Text>
      <Text style={[styles.headerCell, { width: 100 }]}>Status</Text>
      <Text style={[styles.headerCell, { width: 120 }]}>Date</Text>
    </View>

    {filteredTransactions.map((item, index) => (
      <View
        key={`${item.id}-${index}`}
        style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}
      >
        <Text style={[styles.cell, { width: 80 }]}>{item.type}</Text>
        <Text style={[styles.cell, { width: 150 }]}>{item.from}</Text>
        <Text style={[styles.cell, { width: 150 }]}>{item.to}</Text>
        <Text style={[styles.cell, { width: 100 }]}>{`$${item.amount}`}</Text>
        <Text style={[styles.cell, { width: 100 }]}>{item.claimed ? 'Claimed' : 'Pending'}</Text>
        <Text style={[styles.cell, { width: 120 }]}>{item.date.toLocaleDateString()}</Text>
      </View>
    ))}
  </View>
</ScrollView>



      <BottomNav active="transactions" navigation={navigation} user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5e7eb' },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#fff' },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0A1F44', padding: 8, borderRadius: 10, width: '48%', justifyContent: 'center' },
  dateText: { color: '#fff', marginLeft: 5, fontSize: 12, fontWeight: '600' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ccc' },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#f0f4ff' },
  activeFilter: { backgroundColor: '#0A1F44' },
  filterText: { color: '#0A1F44', fontWeight: '600', fontSize: 12 },
  activeFilterText: { color: '#fff' },

  scrollContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  tableContainer: { width: '95%', alignItems: 'center' },

  headerRow: { flexDirection: 'row', backgroundColor: '#0A1F44', paddingVertical: 10, borderRadius: 8, marginVertical: 5 },
  headerCell: { color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 13 },
  row: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 5, borderRadius: 6, alignItems: 'center', borderWidth: 1, borderColor: '#ccc' },
  rowEven: { backgroundColor: '#fff' },
  rowOdd: { backgroundColor: '#f9fafb' },
  cell: { fontSize: 12, textAlign: 'center', color: '#0A1F44' },
  
 
 
});


export default History;
