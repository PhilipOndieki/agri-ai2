"use client"

import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, MapPin, Phone, LogOut, Settings, Bell, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { apiCall } from "@/lib/api"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [locationForm, setLocationForm] = useState({
    latitude: '',
    longitude: '',
    city: '',
    country: ''
  })

  const handleUpdateLocation = async () => {
    try {
      const response = await apiCall('/api/auth/profile/location', {
        method: 'PUT',
        body: JSON.stringify(locationForm)
      })
      
      if (response.ok) {
        alert('Location updated successfully!')
        setIsEditingLocation(false)
      }
    } catch (error) {
      alert('Failed to update location')
    }
  }
  
  /* Personal Information - Editable */
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    farmSize: user?.farmSize || ''
  })

  const handleUpdateProfile = async () => {
    try {
      const response = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm)
      })
      
      if (response.ok) {
        alert('Profile updated successfully!')
        setIsEditingProfile(false)
        window.location.reload()
      }
    } catch (error) {
      alert('Failed to update profile')
    }
  }
  const pollAnalysisStatus = async (analysisId: string) => {
      const maxAttempts = 30; // Poll for 30 seconds max
      let attempts = 0;

      const checkStatus = async () => {
          try {
              const response = await fetch(`/api/images/analyses/${analysisId}`, {
                  headers: {
                      'Authorization': `Bearer ${yourAuthToken}` // Replace with your auth method
                  }
              });
              const data = await response.json();

              if (data.data.analysis.status === 'completed') {
                  // Analysis complete - show results
                  console.log('✅ Analysis completed:', data.data.analysis);
                  // Update your UI state here
                  setAnalysisResult(data.data.analysis);
                  setIsAnalyzing(false);
              } else if (data.data.analysis.status === 'failed') {
                  // Analysis failed
                  console.error('❌ Analysis failed');
                  setError('Analysis failed: ' + data.data.analysis.errorMessage);
                  setIsAnalyzing(false);
              } else if (attempts < maxAttempts) {
                  // Still processing - check again
                  attempts++;
                  setTimeout(checkStatus, 1000); // Check every 1 second
              } else {
                  // Timeout
                  setError('Analysis timeout - please try again');
                  setIsAnalyzing(false);
              }
          } catch (error) {
              console.error('Error checking status:', error);
              setError('Failed to check analysis status');
              setIsAnalyzing(false);
          }
      };

      checkStatus();
  };
  const handleUpload = async (formData) => {
      try {
          const response = await uploadImage(formData);
          
          if (response.success) {
              console.log('Upload successful, starting analysis polling...');
              setIsAnalyzing(true);
              pollAnalysisStatus(response.data.analysisId);
          }
      } catch (error) {
          console.error('Upload failed:', error);
      }
  };

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const menuItems = [
    {
      icon: Settings,
      label: "Account Settings",
      description: "Manage your account preferences",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Configure alert preferences",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Profile" showNotifications={false} />

      <main className="container px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {user?.name?.charAt(0) || "F"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Default Farm Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Default Farm Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditingLocation ? (
              <>
                {user?.location?.coordinates?.[0] !== 0 ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {user?.location?.city && user?.location?.country 
                          ? `${user.location.city}, ${user.location.country}`
                          : 'No location set'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No default location set</p>
                )}
                <Button 
                  onClick={() => setIsEditingLocation(true)}
                  variant="outline" 
                  className="w-full"
                >
                  {user?.location?.coordinates && user?.location?.coordinates[0] !== 0 ? 'Update Location' : 'Set Location'}
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g., -1.286389)"
                  value={locationForm.latitude}
                  onChange={(e) => setLocationForm({...locationForm, latitude: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g., 36.817223)"
                  value={locationForm.longitude}
                  onChange={(e) => setLocationForm({...locationForm, longitude: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="City (e.g., Nairobi)"
                  value={locationForm.city}
                  onChange={(e) => setLocationForm({...locationForm, city: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Country (e.g., Kenya)"
                  value={locationForm.country}
                  onChange={(e) => setLocationForm({...locationForm, country: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdateLocation} className="flex-1">
                    Save Location
                  </Button>
                  <Button 
                    onClick={() => setIsEditingLocation(false)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Use Google Maps to find your coordinates
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Info */} 
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditingProfile ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user?.name || 'Not set'}</p>
                  </div>
                </div>

                {user?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user?.profile?.farmSize && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Farm Size</p>
                      <p className="text-sm text-muted-foreground">{user.profile.farmSize}</p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => {
                    setProfileForm({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      farmSize: user?.profile?.farmSize || ''
                    })
                    setIsEditingProfile(true)
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Farm Size</label>
                  <input
                    type="text"
                    placeholder="e.g., 5 acres"
                    value={profileForm.farmSize}
                    onChange={(e) => setProfileForm({...profileForm, farmSize: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md mt-1"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleUpdateProfile} className="flex-1">
                    Save Changes
                  </Button>
                  <Button 
                    onClick={() => setIsEditingProfile(false)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent" size="lg">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">AgriAI v1.0.0</p>
      </main>
    </div>
  )
}