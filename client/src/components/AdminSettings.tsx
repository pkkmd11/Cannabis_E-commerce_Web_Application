import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Settings, Lock, User, Image as ImageIcon } from 'lucide-react';
import { ObjectUploader } from '@/components/ObjectUploader';
import type { SiteSettings } from '@shared/schema';

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

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  tagline: z.string().optional(),
  logoUrl: z.string().optional(),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

export function AdminSettings() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('admin');
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>('');

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

  // Site settings query and form
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/settings'],
  });

  const siteSettingsForm = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    values: {
      siteName: siteSettings?.siteName || 'Nyo',
      tagline: siteSettings?.tagline || 'Premium Cannabis',
      logoUrl: siteSettings?.logoUrl || '',
    },
  });

  const updateSiteSettings = useMutation({
    mutationFn: async (data: Partial<SiteSettingsFormData>) => {
      const response = await apiRequest('PUT', '/api/settings', data);
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Success",
        description: "Site settings updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSiteSettingsSubmit = async (data: SiteSettingsFormData) => {
    const updateData: Partial<SiteSettingsFormData> = {
      siteName: data.siteName,
      tagline: data.tagline || undefined,
    };
    
    // Only include logoUrl if a new one was uploaded or if we have an existing one
    if (uploadedLogoUrl) {
      updateData.logoUrl = uploadedLogoUrl;
    } else if (siteSettings?.logoUrl) {
      updateData.logoUrl = siteSettings.logoUrl;
    }
    
    console.log('Submitting site settings:', updateData);
    
    await updateSiteSettings.mutateAsync(updateData);
    
    // Reset the uploaded logo state after successful submission
    setUploadedLogoUrl('');
  };

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
      <div className="flex items-center gap-2 text-center">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>

      {/* Site Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Site Branding</CardTitle>
          <CardDescription>
            Customize your site's logo, name, and tagline. Recommended logo size: 200×60px (or 400×120px for retina displays).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...siteSettingsForm}>
            <form onSubmit={siteSettingsForm.handleSubmit(handleSiteSettingsSubmit)} className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <FormLabel className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Site Logo
                </FormLabel>
                <FormDescription>
                  Upload a logo (PNG/SVG recommended, max 500KB). Best size: 200×60px or 400×120px for HD displays. After uploading, click "Update Site Settings" to save.
                </FormDescription>
                {siteSettings?.logoUrl && !uploadedLogoUrl && (
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Current logo:</p>
                    <img 
                      src={siteSettings.logoUrl} 
                      alt="Current logo" 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <ObjectUploader
                  onComplete={(urls: string[]) => {
                    if (urls.length > 0) {
                      console.log('Logo uploaded successfully:', urls[0]);
                      setUploadedLogoUrl(urls[0]);
                      siteSettingsForm.setValue('logoUrl', urls[0]);
                      toast({
                        title: "Logo uploaded",
                        description: "Click 'Update Site Settings' to save the changes.",
                      });
                    }
                  }}
                  maxNumberOfFiles={1}
                  maxFileSize={500 * 1024}
                  buttonClassName="w-full"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Upload Logo
                </ObjectUploader>
                {uploadedLogoUrl && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-2">New logo uploaded:</p>
                    <img 
                      src={uploadedLogoUrl} 
                      alt="New logo" 
                      className="h-16 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Site Name */}
              <FormField
                control={siteSettingsForm.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter site name" 
                        {...field}
                        data-testid="input-site-name"
                      />
                    </FormControl>
                    <FormDescription>
                      The main name of your site (e.g., "Nyo")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tagline */}
              <FormField
                control={siteSettingsForm.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tagline" 
                        {...field}
                        data-testid="input-tagline"
                      />
                    </FormControl>
                    <FormDescription>
                      A short description displayed next to your logo (e.g., "Premium Cannabis")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    siteSettingsForm.reset();
                    setUploadedLogoUrl('');
                  }}
                  disabled={updateSiteSettings.isPending}
                  data-testid="button-cancel-site-settings"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updateSiteSettings.isPending}
                  data-testid="button-save-site-settings"
                >
                  {updateSiteSettings.isPending ? 'Updating...' : 'Update Site Settings'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Admin Credentials Card */}
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
