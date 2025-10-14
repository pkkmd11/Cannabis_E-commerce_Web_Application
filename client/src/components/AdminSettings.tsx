import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { Settings, Lock, User } from 'lucide-react';

const settingsFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newUsername: z.string().min(3, 'Username must be at least 3 characters').optional().or(z.literal('')),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

export function AdminSettings() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('admin');

  useEffect(() => {
    // Get username from sessionStorage
    const storedUsername = sessionStorage.getItem('adminUsername');
    if (storedUsername) {
      setCurrentUsername(storedUsername);
    }
  }, []);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      currentPassword: '',
      newUsername: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: SettingsFormData) => {
    try {
      setIsSubmitting(true);

      // Only send fields that have values
      const updateData: any = {
        currentUsername: currentUsername,
        currentPassword: data.currentPassword,
      };

      if (data.newUsername && data.newUsername.trim() !== '') {
        updateData.newUsername = data.newUsername.trim();
      }

      if (data.newPassword && data.newPassword.trim() !== '') {
        updateData.newPassword = data.newPassword.trim();
      }

      const response = await apiRequest('POST', '/api/admin/update-credentials', updateData);
      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message || "Credentials updated successfully",
        });

        // Update current username display and sessionStorage if changed
        if (result.username) {
          setCurrentUsername(result.username);
          sessionStorage.setItem('adminUsername', result.username);
        }

        // Reset form
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Change Admin Credentials</CardTitle>
          <CardDescription>
            Update your admin username and/or password. You must enter your current password to make changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Current Username Display */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Current username: <strong>{currentUsername}</strong></span>
                </div>
              </div>

              {/* Current Password */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password *</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="Enter current password" 
                          {...field}
                          data-testid="input-current-password"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Required to verify your identity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  You can change one or both fields below. Leave blank to keep unchanged.
                </p>

                {/* New Username */}
                <FormField
                  control={form.control}
                  name="newUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Username (optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="text" 
                            placeholder="Enter new username or leave blank" 
                            {...field}
                            data-testid="input-new-username"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Must be at least 3 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>New Password (optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="Enter new password or leave blank" 
                            {...field}
                            data-testid="input-new-password"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Must be at least 6 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-muted-foreground" />
                          <Input 
                            type="password" 
                            placeholder="Confirm new password" 
                            {...field}
                            disabled={!form.watch('newPassword')}
                            data-testid="input-confirm-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting}
                  data-testid="button-cancel-settings"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="button-save-settings"
                >
                  {isSubmitting ? 'Updating...' : 'Update Credentials'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
