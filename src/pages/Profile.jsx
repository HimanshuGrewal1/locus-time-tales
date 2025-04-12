
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) return;
    
    setIsLoading(true);
    try {
      await updateUser(userData);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 flex items-start justify-center p-4 pt-8">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userData?.avatar} alt={userData?.nickname} />
                <AvatarFallback className="text-xl">
                  {userData?.nickname ? getInitials(userData.nickname) : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{isEditing ? "Edit Profile" : "Your Profile"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update your account details" : "View and manage your account"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input 
                      id="nickname" 
                      value={userData?.nickname || ""}
                      onChange={(e) => setUserData(prev => prev ? {...prev, nickname: e.target.value} : null)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input 
                      id="avatar" 
                      value={userData?.avatar || ""}
                      onChange={(e) => setUserData(prev => prev ? {...prev, avatar: e.target.value} : null)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Nickname</p>
                    <p>{userData?.nickname}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{userData?.id}</p>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Joined</p>
                    <p>{new Date(userData?.createdAt || "").toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              {isEditing ? (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUserData(user);
                      setIsEditing(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="flex-1"
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="flex-1"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Profile;
