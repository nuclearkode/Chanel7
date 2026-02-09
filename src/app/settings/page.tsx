"use client"
import AppSidebar from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  title: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
})

const preferencesFormSchema = z.object({
    theme: z.enum(["light", "dark", "system"]),
    units: z.enum(["grams", "ml", "ounces"])
})

export default function SettingsPage() {
    const { toast } = useToast()

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "Jane Doe",
            title: "Artisan Perfumer",
            email: "jane.doe@example.com",
        },
    })

    const preferencesForm = useForm<z.infer<typeof preferencesFormSchema>>({
        resolver: zodResolver(preferencesFormSchema),
        defaultValues: {
            theme: "system",
            units: "grams",
        },
    })

    function onProfileSubmit(data: z.infer<typeof profileFormSchema>) {
        console.log("Profile data submitted:", data)
        toast({
            title: "Profile Saved",
            description: "Your personal information has been updated.",
        })
    }

    function onPreferencesSubmit(data: z.infer<typeof preferencesFormSchema>) {
        console.log("Preferences data submitted:", data)
        toast({
            title: "Preferences Saved",
            description: "Your settings have been updated.",
        })
    }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col h-full">
            <h1 className="text-3xl font-bold text-foreground font-headline mb-6">Settings</h1>
            <div className="max-w-2xl mx-auto space-y-8">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                    <Card>
                        <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={profileForm.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={profileForm.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                         <FormField control={profileForm.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                         )}/>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Profile</Button>
                        </CardFooter>
                    </Card>
                </form>
              </Form>

              <Form {...preferencesForm}>
                <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}>
                    <Card>
                        <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your ScentForge experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <FormField control={preferencesForm.control} name="theme" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Theme</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a theme" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                           )} />
                           <FormField control={preferencesForm.control} name="units" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Default Units</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select default units" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="grams">Grams (g)</SelectItem>
                                            <SelectItem value="ml">Milliliters (ml)</SelectItem>
                                            <SelectItem value="ounces">Ounces (oz)</SelectItem>
                                        </SelectContent>
                                     </Select>
                                     <FormMessage />
                                </FormItem>
                           )} />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </form>
              </Form>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
