import { Button } from "@/shared/ui";
import { useAuth } from "@/services/auth";

export interface ILogoutButtonProps {
  className?: string;
}

function LogoutButton({ className }: ILogoutButtonProps) {
  const { logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading} className={className}>
      Logout
    </Button>
  );
}

export default LogoutButton;
