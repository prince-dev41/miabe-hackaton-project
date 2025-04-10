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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { Heart } from "lucide-react";

// Import des assets
import telemedLogo from "../assets/telemed-logo.svg";
import doctorIllustration from "../assets/doctor-illustration.svg";

const loginSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Appel de la fonction de connexion du contexte d'authentification
      await login(data.username, data.password);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord médical."
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Nom d'utilisateur ou mot de passe incorrect.",
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Bienvenue !</h1>
            <p className="text-gray-600">
              TeleMed vous aide à gérer vos consultations et dossiers médicaux de manière simple et sécurisée.
            </p>
          </div>
          
          {/* Formulaire */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Bouton Google (comme sur l'exemple) */}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full py-6 flex items-center justify-center gap-2 border border-gray-300"
                  onClick={() => toast({
                    title: "Connexion Google",
                    description: "Cette fonctionnalité sera disponible prochainement."
                  })}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                      <path d="M21.35,11.1H12.18V13.83H18.69C18.36,15.64 16.96,17.45 14.37,17.45C11.6,17.45 9.35,15.28 9.35,12.41C9.35,9.54 11.6,7.37 14.37,7.37C15.93,7.37 17.13,7.99 17.87,8.64L19.89,6.62C18.45,5.27 16.5,4.37 14.37,4.37C9.91,4.37 6.27,8.01 6.27,12.41C6.27,16.81 9.91,20.45 14.37,20.45C18.92,20.45 21.79,17.35 21.79,12.71C21.79,12.06 21.68,11.56 21.54,11.1L21.35,11.1Z" fill="#EA4335"></path>
                      <path d="M3.04,9.87C3.88,7.77 5.78,6.18 8.04,5.71V2.58C4.84,3.12 2.1,6.02 1.04,9.67L3.04,9.87Z" fill="#FBBC05"></path>
                      <path d="M8.04,18.11C5.83,17.65 3.97,16.12 3.07,14.09L1.07,14.28C2.15,17.85 4.84,20.67 8.04,21.21L8.04,18.11Z" fill="#34A853"></path>
                      <path d="M1.07,9.67L3.07,9.87C3.97,7.84 5.83,6.31 8.04,5.86L8.04,2.76C4.84,3.3 2.15,6.12 1.07,9.67Z" fill="#4285F4"></path>
                    </g>
                  </svg>
                  <span>Se connecter avec Google</span>
                </Button>
                
                {/* Séparateur */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OU</span>
                  </div>
                </div>
                
                {/* Champs de formulaire */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Entrez votre nom d'utilisateur" 
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
                          placeholder="Entrez votre mot de passe" 
                          className="py-5 px-4 rounded-md border-gray-300" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-6 text-base font-medium bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
              
              <div className="text-sm text-center space-y-2">
                <a href="#" className="text-primary hover:text-primary/90">
                  Mot de passe oublié?
                </a>
                <div>
                  Vous n'avez pas de compte ?{" "}
                  <a 
                    onClick={() => navigate("/register")} 
                    className="text-primary hover:text-primary/90 cursor-pointer"
                  >
                    S'inscrire
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
      
      {/* Partie droite - Témoignage et illustration */}
      <div className="hidden md:flex md:w-1/2 bg-blue-50 flex-col justify-center relative">
        <div className="p-12 max-w-lg mx-auto">
          {/* Section témoignage */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <blockquote className="text-lg font-medium text-gray-800 mb-4">
              "Une plateforme remarquable pour la télémédecine, qui nous permet de suivre nos patients à distance tout en maintenant une excellente qualité de service."
            </blockquote>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                MD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Dr. Marie Dupont</p>
                <p className="text-sm text-gray-500">Médecin généraliste à Cotonou</p>
              </div>
            </div>
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