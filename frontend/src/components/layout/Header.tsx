import { Link, useLocation } from 'react-router-dom';
import { MapPin, List, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useUnit } from '@/contexts/UnitContext';

export default function Header() {
  const location = useLocation();
  const { unit, toggleUnit } = useUnit();

  const navItems = [
    { path: '/', label: 'Map', icon: MapPin },
    { path: '/cities', label: 'Cities', icon: List },
    { path: '/cities/add', label: 'Add City', icon: Plus },
  ];

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="text-xl font-bold">Weather Mapper</span>
          </Link>

          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className={cn('flex items-center space-x-2', isActive && 'bg-primary text-primary-foreground')}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <div className="flex items-center space-x-1 ml-2 px-2 py-1 rounded-md border">
              <button
                onClick={() => unit !== 'C' && toggleUnit()}
                className={cn(
                  'px-2 py-1 rounded transition-colors',
                  unit === 'C'
                    ? 'font-semibold text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                °C
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => unit !== 'F' && toggleUnit()}
                className={cn(
                  'px-2 py-1 rounded transition-colors',
                  unit === 'F'
                    ? 'font-semibold text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                °F
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

