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
    <div className="min-h-screen flex bg-white">
      {/* Partie gauche - Formulaire */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-8">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="mb-8">
            <img src={telemedLogo} alt="TeleMed Logo" className="h-10 w-auto" />
          </div>
          
          {/* Titre et description */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Créer un compte</h1>
            <p className="text-gray-600">
              Inscrivez-vous pour accéder à notre plateforme de télémédecine et commencer à gérer vos patients et consultations.
            </p>
          </div>
          
          {/* Formulaire */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nom complet</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Entrez votre nom complet" 
                          className="py-5 px-4 rounded-md border-gray-300" 
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-700">Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Entrez un nom d'utilisateur" 
                          className="py-5 px-4 rounded-md border-gray-300" 
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Entrez votre adresse email" 
                          className="py-5 px-4 rounded-md border-gray-300" 
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Créez un mot de passe" 
                          className="py-5 px-4 rounded-md border-gray-300" 
                          {...field} 
                        />
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
                      <FormLabel className="text-gray-700">Type d'utilisateur</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="py-5 px-4 rounded-md border-gray-300">
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
                        <FormLabel className="text-gray-700">Spécialité</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="py-5 px-4 rounded-md border-gray-300">
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
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-base font-medium bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
              
              <div className="text-sm text-center">
                Vous avez déjà un compte ?{" "}
                <a 
                  onClick={() => navigate("/login")} 
                  className="text-primary hover:text-primary/90 cursor-pointer"
                >
                  Se connecter
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
      
      {/* Partie droite - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-blue-50 flex-col justify-center relative">
        <div className="p-12 max-w-lg mx-auto">
          {/* Section descriptive */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Pourquoi rejoindre TeleMed ?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Gérez facilement vos rendez-vous médicaux</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Accédez de manière sécurisée aux dossiers médicaux</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Communiquez facilement avec vos patients</span>
              </li>
            </ul>
          </div>
          
          {/* Image d'illustration */}
          <img 
            src={doctorIllustration} 
            alt="Illustration de télémédecine" 
            className="w-full h-auto max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  );
}