import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Mail,
  Bell,
  Save,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Schéma de validation pour le profil
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

// Schéma de validation pour le changement de mot de passe
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Veuillez entrer votre mot de passe actuel' }),
  newPassword: z.string().min(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' }),
  confirmPassword: z.string().min(6, { message: 'Veuillez confirmer votre nouveau mot de passe' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma de validation pour le mot de passe oublié
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
});

// Schéma de validation pour les notifications
const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  appointmentReminders: z.boolean(),
  marketingEmails: z.boolean(),
  language: z.string(),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  // Formulaire du profil
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      specialty: '',
      phone: '',
      address: '',
      bio: '',
    },
  });

  // Formulaire du mot de passe
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Formulaire de mot de passe oublié
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: user?.email || '',
    },
  });

  // Formulaire des notifications
  const notificationsForm = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      appointmentReminders: true,
      marketingEmails: false,
      language: 'fr',
    },
  });

  // Soumission du formulaire de profil
  const onProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    toast({
      title: 'Profil mis à jour',
      description: 'Vos informations ont été mises à jour avec succès.',
    });
    console.log('Profil Data:', data);
  };

  // Soumission du formulaire de mot de passe
  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    toast({
      title: 'Mot de passe modifié',
      description: 'Votre mot de passe a été changé avec succès.',
    });
    console.log('Password Data:', data);
    passwordForm.reset();
  };

  // Soumission du formulaire de mot de passe oublié
  const onForgotPasswordSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    toast({
      title: 'Demande envoyée',
      description: 'Un email de réinitialisation a été envoyé à votre adresse email.',
    });
    console.log('Forgot Password Data:', data);
    setIsResetPasswordOpen(false);
  };

  // Soumission du formulaire des notifications
  const onNotificationsSubmit = (data: z.infer<typeof notificationsSchema>) => {
    toast({
      title: 'Préférences sauvegardées',
      description: 'Vos préférences de notification ont été mises à jour.',
    });
    console.log('Notifications Data:', data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres du compte</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Avancé</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Nom Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="exemple@telemed.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spécialité</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre spécialité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">Médecine générale</SelectItem>
                              <SelectItem value="cardiology">Cardiologie</SelectItem>
                              <SelectItem value="dermatology">Dermatologie</SelectItem>
                              <SelectItem value="neurology">Neurologie</SelectItem>
                              <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                              <SelectItem value="psychiatry">Psychiatrie</SelectItem>
                              <SelectItem value="other">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+229 XX XX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse professionnelle</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse de votre cabinet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biographie</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Décrivez votre parcours professionnel et votre expérience"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Changer de mot de passe</CardTitle>
              <CardDescription>
                Mettez à jour votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe actuel</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Entrez votre mot de passe actuel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Entrez votre nouveau mot de passe"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Le mot de passe doit contenir au moins 6 caractères
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirmez votre nouveau mot de passe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Mettre à jour
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mot de passe oublié</CardTitle>
              <CardDescription>
                Envoyez un lien de réinitialisation à votre adresse email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Entrez votre adresse email"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Nous vous enverrons un lien de réinitialisation à cette adresse
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Envoyer le lien
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notifications par email</FormLabel>
                            <FormDescription>
                              Recevoir des notifications générales par email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="appointmentReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Rappels de rendez-vous</FormLabel>
                            <FormDescription>
                              Recevoir des rappels pour vos rendez-vous à venir
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Emails marketing</FormLabel>
                            <FormDescription>
                              Recevoir des informations sur les nouveautés et offres
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={notificationsForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Langue préférée</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une langue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">Anglais</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          La langue utilisée pour les emails et notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Enregistrer les préférences
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Avancé */}
        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres avancés</CardTitle>
              <CardDescription>
                Options avancées et exportation des données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2 rounded-lg border p-4">
                <h3 className="font-medium text-lg">Exporter mes données</h3>
                <p className="text-sm text-muted-foreground">
                  Téléchargez une copie de vos données personnelles et activités sur TeleMed
                </p>
                <div className="mt-2">
                  <Button variant="outline" onClick={() => {
                    toast({
                      title: "Exportation en cours",
                      description: "Vos données seront bientôt prêtes à être téléchargées.",
                    });
                  }}>
                    Exporter les données
                  </Button>
                </div>
              </div>

              <div className="flex flex-col space-y-2 rounded-lg border p-4">
                <h3 className="font-medium text-lg">Supprimer mon compte</h3>
                <p className="text-sm text-muted-foreground">
                  Supprimer définitivement votre compte et toutes vos données personnelles
                </p>
                <div className="mt-2">
                  <Button variant="destructive" onClick={() => {
                    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
                      toast({
                        title: "Compte supprimé",
                        description: "Votre compte a été supprimé avec succès.",
                        variant: "destructive",
                      });
                    }
                  }}>
                    Supprimer le compte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}