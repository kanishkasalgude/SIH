import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { BackgroundWrapper } from './BackgroundWrapper';
import { Header } from './Header';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { signIn } from '../services/firebaseService';

interface LoginPageProps {
  role: 'farmer' | 'distributor' | 'retailer';
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  onSignupRedirect: () => void;
}

export function LoginPage({ role, onBack, onLogin, onSignupRedirect }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPassword) {
      // Handle forgot password
      alert('Password reset link sent to your email!');
      setForgotPassword(false);
    } else {
      try {
        await signIn(email, password);
        // onLogin will be called automatically via Firebase auth state change
      } catch (error: any) {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  return (
    <BackgroundWrapper type={role}>
      <Header />
      
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-foreground hover:bg-card/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-center">
                {forgotPassword ? 'Reset Password' : t('login')}
              </CardTitle>
              <p className="text-center text-muted-foreground">
                {forgotPassword 
                  ? 'Enter your email to reset password'
                  : `${t(role)} ${t('login').toLowerCase()}`
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-input-background"
                  />
                </div>
                
                {!forgotPassword && (
                  <div>
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-input-background"
                    />
                  </div>
                )}

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {forgotPassword ? 'Send Reset Link' : t('login')}
                </Button>

                {!forgotPassword && (
                  <>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setForgotPassword(true)}
                      className="w-full text-primary"
                    >
                      Forgot Password?
                    </Button>

                    <div className="text-center">
                      <span className="text-muted-foreground">Don't have an account? </span>
                      <Button
                        type="button"
                        variant="link"
                        onClick={onSignupRedirect}
                        className="text-primary p-0"
                      >
                        {t('signup')}
                      </Button>
                    </div>
                  </>
                )}

                {forgotPassword && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setForgotPassword(false)}
                    className="w-full text-primary"
                  >
                    Back to Login
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  );
}