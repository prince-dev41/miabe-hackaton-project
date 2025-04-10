import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Import des assets
import telemedLogo from "../assets/telemed-logo.svg";
import doctorIllustration from "../assets/doctor-illustration.svg";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  userType: z.enum(["doctor", "patient"], {
    required_error: "Veuillez sélectionner un type d'utilisateur",
  }),
  specialty: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      userType: "doctor",
      specialty: "",
    },
  });

  const watchUserType = form.watch("userType");
  const isDoctor = watchUserType === "doctor";

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulation d'un appel API d'inscription
      setTimeout(() => {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
        });
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-8 max-w-6xl mx-auto">
          {/* Illustration côté droit (visible uniquement sur les grands écrans) */}
          <div className="hidden lg:block w-full lg:w-1/2">
            <div className="p-6">
              <img 
                src={doctorIllustration} 
                alt="Illustration de télémédecine" 
                className="w-full h-auto max-w-xl mx-auto"
              />
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Rejoignez notre réseau médical</h2>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Créez votre compte en quelques étapes simples et commencez à utiliser notre plateforme de télémédecine sécurisée.
                </p>
              </div>
            </div>
          </div>
          
          {/* Formulaire d'inscription */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4">
                <img src={telemedLogo} alt="TeleMed Logo" className="h-20 w-20" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">TeleMed</h1>
              <p className="text-gray-600 mt-2">Plateforme de télémédecine pour professionnels de la santé</p>
            </div>
            
            <Card className="border-none shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
                <CardDescription className="text-center">
                  Remplissez le formulaire ci-dessous pour créer votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Entrez votre nom complet" className="py-6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <Input placeholder="Entrez un nom d'utilisateur" className="py-6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Entrez votre adresse email" className="py-6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Créez un mot de passe" className="py-6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type d'utilisateur</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="py-6">
                                <SelectValue placeholder="Sélectionnez un type d'utilisateur" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="doctor">Médecin</SelectItem>
                              <SelectItem value="patient">Patient</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isDoctor && (
                      <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Spécialité</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-6">
                                  <SelectValue placeholder="Sélectionnez votre spécialité" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">Médecine générale</SelectItem>
                                <SelectItem value="cardiology">Cardiologie</SelectItem>
                                <SelectItem value="dermatology">Dermatologie</SelectItem>
                                <SelectItem value="neurology">Neurologie</SelectItem>
                                <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <Button type="submit" className="w-full py-6 text-base mt-2" disabled={isLoading}>
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-center w-full">
                  Vous avez déjà un compte?{" "}
                  <a 
                    onClick={() => navigate("/login")} 
                    className="text-primary-600 hover:text-primary-700 cursor-pointer"
                  >
                    Se connecter
                  </a>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}