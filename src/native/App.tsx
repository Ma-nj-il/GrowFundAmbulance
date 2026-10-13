/**
 * RESQ Nepal - Native React Native Mobile Application Entry Point
 * Designed for Expo Development Builds with Google Maps & Progressive Radius Matching.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';

// State models and constants can be imported from shared store modules
export default function App() {
  const [activeMode, setActiveMode] = useState<'user' | 'driver'>('user');
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'safety' | 'settings'>('home');
  const [searchRadius, setSearchRadius] = useState<number>(2);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const startAmbulanceSearch = () => {
    setIsSearching(true);
    setSearchRadius(2);

    // Progressive radius simulation: 2km -> 5km -> 10km -> 15km -> 20km
    const radii = [2, 5, 10, 15, 20];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < radii.length) {
        setSearchRadius(radii[step]);
      } else {
        clearInterval(interval);
        Alert.alert(
          'Ambulance Matched',
          'Assigned: Ba 1 Jha 9021 (Hari Sundar Shrestha - ALS Unit). Arriving in 8 mins.'
        );
        setIsSearching(false);
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#181A1F" />

      {/* Top Brand Bar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandRed}>RESQ </Text>
          <Text style={styles.brandWhite}>NEPAL</Text>
        </View>
        <TouchableOpacity
          onPress={() => setActiveMode(activeMode === 'user' ? 'driver' : 'user')}
          style={[styles.modeBadge, activeMode === 'driver' && styles.driverBadge]}
        >
          <Text style={styles.modeText}>
            {activeMode === 'driver' ? '🚑 Driver Mode' : '👤 User Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Body */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeMode === 'user' ? (
          <View style={styles.cardSection}>
            {/* Call Emergency Ambulance Hero Card */}
            <TouchableOpacity
              onPress={startAmbulanceSearch}
              style={styles.heroCard}
              activeOpacity={0.85}
            >
              <View style={styles.ambulanceCircle}>
                <Text style={styles.ambulanceEmoji}>🚑</Text>
              </View>
              <Text style={styles.heroTitle}>Call Emergency Ambulance</Text>
              <Text style={styles.heroSubtitle}>आपतकालीन एम्बुलेन्स बोलाउनुहोस्</Text>
              <View style={styles.availabilityPill}>
                <View style={styles.greenDot} />
                <Text style={styles.availabilityText}>5 Ambulances Available</Text>
              </View>
            </TouchableOpacity>

            {/* Progressive Search Radar Indicator */}
            {isSearching && (
              <View style={styles.radarCard}>
                <Text style={styles.radarTitle}>Searching within {searchRadius} km...</Text>
                <Text style={styles.radarSubtitle}>
                  Expanding search radius across Kathmandu Valley.
                </Text>
                <TouchableOpacity
                  onPress={() => setIsSearching(false)}
                  style={styles.cancelSearchBtn}
                >
                  <Text style={styles.cancelText}>Cancel Search</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Quick Action Tiles */}
            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.actionTile}>
                <Text style={styles.tileEmoji}>🏥</Text>
                <Text style={styles.tileTitle}>Nearby Hospitals</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionTile}>
                <Text style={styles.tileEmoji}>⏱️</Text>
                <Text style={styles.tileTitle}>My Rides</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <TouchableOpacity style={styles.actionTile}>
                <Text style={styles.tileEmoji}>📞</Text>
                <Text style={styles.tileTitle}>Call 100 SOS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionTile}>
                <Text style={styles.tileEmoji}>🛡️</Text>
                <Text style={styles.tileTitle}>Safety & EMT</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Driver View */
          <View style={styles.driverSection}>
            <View style={styles.driverCard}>
              <Text style={styles.driverTitle}>Hari Sundar Shrestha</Text>
              <Text style={styles.driverSub}>Ba 1 Jha 9021 • ALS Ambulance</Text>
              <Text style={styles.driverStatus}>● ONLINE & ON DUTY</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A1F',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#252A33',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandRed: {
    color: '#D62828',
    fontSize: 18,
    fontWeight: '900',
  },
  brandWhite: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  modeBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  driverBadge: {
    backgroundColor: '#10B981',
  },
  modeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    padding: 16,
  },
  cardSection: {
    gap: 16,
  },
  heroCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  ambulanceCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#D62828',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  ambulanceEmoji: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D62828',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  radarCard: {
    backgroundColor: '#252A33',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D62828',
  },
  radarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F87171',
  },
  radarSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  cancelSearchBtn: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionTile: {
    flex: 1,
    backgroundColor: '#252A33',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  tileEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  tileTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  driverSection: {
    padding: 8,
  },
  driverCard: {
    backgroundColor: '#252A33',
    padding: 20,
    borderRadius: 20,
  },
  driverTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  driverSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
  },
  driverStatus: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
    marginTop: 10,
  },
});
