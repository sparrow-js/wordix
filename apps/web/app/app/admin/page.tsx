"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "sonner";

export default function AdminPage() {
  const fetchAddUser = async () => {
    try {
      const response = await fetch("/api/one-api/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchAddToken = async () => {
    const response = await fetch("/api/one-api/addtoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <Button onClick={fetchAddUser}>Add User</Button>
      <Button onClick={fetchAddToken}>Add Token</Button>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-2xl">0</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Active Sessions</h3>
              <p className="text-2xl">0</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Server Status</h3>
              <p className="text-green-500">Online</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="border rounded-lg p-4">
            <p>User management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="border rounded-lg p-4">
            <p>Settings panel coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
}
