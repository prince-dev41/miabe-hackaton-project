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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          {/* Illustration côté gauche (visible uniquement sur les grands écrans) */}
          <div className="hidden lg:block w-full lg:w-1/2">
            <div className="p-6">
              <img 
                src={doctorIllustration} 
                alt="Illustration de télémédecine" 
                className="w-full h-auto max-w-xl mx-auto"
              />
              <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Des soins médicaux à portée de clic</h2>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Accédez à vos dossiers médicaux, gérez vos rendez-vous et suivez vos patients facilement grâce à notre plateforme sécurisée de télémédecine.
                </p>
              </div>
            </div>
          </div>
          
          {/* Formulaire de connexion */}
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
                <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                <CardDescription className="text-center">
                  Entrez vos identifiants pour accéder à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <Input placeholder="Entrez votre nom d'utilisateur" className="py-6" {...field} />
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
                            <Input type="password" placeholder="Entrez votre mot de passe" className="py-6" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full py-6 text-base mt-2" disabled={isLoading}>
                      {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="text-sm text-center">
                  <a href="#" className="text-primary-600 hover:text-primary-700">
                    Mot de passe oublié?
                  </a>
                </div>
                <div className="text-sm text-center mt-2">
                  Vous n'avez pas de compte?{" "}
                  <a 
                    onClick={() => navigate("/register")} 
                    className="text-primary-600 hover:text-primary-700 cursor-pointer"
                  >
                    S'inscrire
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