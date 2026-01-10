import AsyncStorage from '@react-native-async-storage/async-storage';

const FILE_STORAGE_KEY = 'users';
const PENDING_TRANSFERS_KEY = 'pending_transfers';

// Normalize phone numbers consistently
const normalizePhone = (phone) =>
  phone.replace(/\s/g, '').replace(/^\+/, '');

const FileStorage = {
  // -------------------------------------------------------------
  // Initialize storage
  // -------------------------------------------------------------
  initialize: async () => {
    try {
      const users = await AsyncStorage.getItem(FILE_STORAGE_KEY);
      if (!users)
        await AsyncStorage.setItem(FILE_STORAGE_KEY, JSON.stringify([]));

      const pendings = await AsyncStorage.getItem(PENDING_TRANSFERS_KEY);
      if (!pendings)
        await AsyncStorage.setItem(
          PENDING_TRANSFERS_KEY,
          JSON.stringify([])
        );

      // Ensure all users have a default password
      const parsedUsers =
        JSON.parse(await AsyncStorage.getItem(FILE_STORAGE_KEY)) || [];

      const updatedUsers = parsedUsers.map((u) => ({
        ...u,
        password: u.password || '123456',
      }));

      await AsyncStorage.setItem(
        FILE_STORAGE_KEY,
        JSON.stringify(updatedUsers)
      );
    } catch (err) {
      console.log('FileStorage.initialize error:', err);
    }
  },

  // -------------------------------------------------------------
  // Users
  // -------------------------------------------------------------
  getUsers: async () => {
    const raw = await AsyncStorage.getItem(FILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  addUser: async (userData) => {
    const users = await FileStorage.getUsers();

    if (
      users.some(
        (u) =>
          normalizePhone(u.phoneNumber || u.phone) ===
          normalizePhone(userData.phoneNumber)
      )
    ) {
      return { success: false, message: 'Phone number already exists' };
    }

    userData.balance = userData.balance ?? 0;
    userData.password = userData.password || '123456';

    users.push(userData);
    await AsyncStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(users));

    return { success: true, user: userData };
  },

  phoneExists: async (phoneNumber) => {
    const users = await FileStorage.getUsers();
    return users.some(
      (u) =>
        normalizePhone(u.phoneNumber || u.phone) ===
        normalizePhone(phoneNumber)
    );
  },

  validateUser: async (phone, password) => {
    const users = await FileStorage.getUsers();
    const cleanPhone = normalizePhone(phone);

    const user = users.find(
      (u) => normalizePhone(u.phoneNumber || u.phone) === cleanPhone
    );

    if (!user) return { success: false, message: 'User not found' };

    if ((user.password || '').trim() !== password.trim())
      return { success: false, message: 'Incorrect password' };

    return { success: true, user };
  },

  getUserBalance: async (phoneNumber) => {
    const users = await FileStorage.getUsers();
    const user = users.find(
      (u) =>
        normalizePhone(u.phoneNumber || u.phone) ===
        normalizePhone(phoneNumber)
    );
    return user ? user.balance : null;
  },

  updateUserBalance: async (phoneNumber, newBalance) => {
    const users = await FileStorage.getUsers();

    const idx = users.findIndex(
      (u) =>
        normalizePhone(u.phoneNumber || u.phone) ===
        normalizePhone(phoneNumber)
    );

    if (idx === -1) return false;

    users[idx].balance = newBalance;

    await AsyncStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(users));
    return true;
  },

  updateUser: async (updatedUser) => {
    try {
      const users = await FileStorage.getUsers();

      const idx = users.findIndex(
        (u) =>
          normalizePhone(u.phoneNumber || u.phone) ===
          normalizePhone(updatedUser.phoneNumber || updatedUser.phone)
      );

      if (idx === -1) return false;

      users[idx] = { ...users[idx], ...updatedUser };

      await AsyncStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (err) {
      console.log('updateUser error:', err);
      return false;
    }
  },

  deleteUser: async (phoneNumber) => {
    try {
      const users = await FileStorage.getUsers();

      const filteredUsers = users.filter(
        (u) =>
          normalizePhone(u.phoneNumber || u.phone) !==
          normalizePhone(phoneNumber)
      );

      if (filteredUsers.length === users.length) {
        // User not found
        return false;
      }

      await AsyncStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(filteredUsers));
      return true;
    } catch (err) {
      console.log('deleteUser error:', err);
      return false;
    }
  },

  // -------------------------------------------------------------
  // Pending Transfers
  // -------------------------------------------------------------
  getPendingTransfers: async () => {
    const raw = await AsyncStorage.getItem(PENDING_TRANSFERS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  getPendingTransfersForUser: async (phone) => {
    const normalizedPhone = normalizePhone(phone);
    const transfers = await FileStorage.getPendingTransfers();

    return transfers.filter(
      (t) => normalizePhone(t.to) === normalizedPhone && !t.claimed
    );
  },

  getPendingTransfersBySender: async (phone) => {
    const normalizedPhone = normalizePhone(phone);
    const transfers = await FileStorage.getPendingTransfers();

    return transfers.filter(
      (t) => normalizePhone(t.from) === normalizedPhone && !t.claimed
    );
  },

  addPendingTransfer: async (transfer) => {
    try {
      const transfers = await FileStorage.getPendingTransfers();

      const newTransfer = {
        id: Date.now().toString(),
        from: transfer.from,
        to: transfer.to,
        amount: transfer.amount,
        note: transfer.note || '',
        claimed: false,
        createdAt: new Date().toISOString(),
      };

      transfers.push(newTransfer);

      await AsyncStorage.setItem(
        PENDING_TRANSFERS_KEY,
        JSON.stringify(transfers)
      );

      return true;
    } catch (err) {
      console.log('addPendingTransfer error:', err);
      return false;
    }
  },

  markTransferClaimed: async (id) => {
    try {
      const transfers = await FileStorage.getPendingTransfers();
      const idx = transfers.findIndex((t) => t.id === id);

      if (idx === -1) return false;

      transfers[idx].claimed = true;
      transfers[idx].claimedAt = new Date().toISOString();

      await AsyncStorage.setItem(
        PENDING_TRANSFERS_KEY,
        JSON.stringify(transfers)
      );

      return true;
    } catch (err) {
      console.log('markTransferClaimed error:', err);
      return false;
    }
  },

  // -------------------------------------------------------------
  // Debug / Utility
  // -------------------------------------------------------------
  printUsers: async () => {
    const users = await FileStorage.getUsers();
    console.log('Users in storage:', users);
  },

  saveUsersToFile: async () => {
    try {
      const users = await FileStorage.getUsers();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `users_backup_${timestamp}.json`;
      
      // For React Native, we'll use expo-file-system if available
      // Otherwise, we'll save to AsyncStorage with a different key
      const backupKey = `backup_${timestamp}`;
      await AsyncStorage.setItem(backupKey, JSON.stringify(users, null, 2));
      
      console.log(`Users backed up to: ${backupKey}`);
      console.log('Total users backed up:', users.length);
      
      return { success: true, key: backupKey, count: users.length };
    } catch (err) {
      console.log('Error saving users to file:', err);
      return { success: false, error: err.message };
    }
  },

  getAllBackups: async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const backupKeys = allKeys.filter(key => key.startsWith('backup_'));
      return backupKeys;
    } catch (err) {
      console.log('Error getting backups:', err);
      return [];
    }
  },

  loadBackup: async (backupKey) => {
    try {
      const data = await AsyncStorage.getItem(backupKey);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.log('Error loading backup:', err);
      return null;
    }
  },

  clearAllData: async () => {
    try {
      await AsyncStorage.removeItem(FILE_STORAGE_KEY);
      await AsyncStorage.removeItem(PENDING_TRANSFERS_KEY);
      console.log('Storage cleared successfully.');
      return true;
    } catch (err) {
      console.log('Error clearing storage:', err);
      return false;
    }
  },
};

export default FileStorage;