'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useLingui } from '@lingui/react/macro';
import { Monitor, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

export function ThemeSwitcher() {
  const { t } = useLingui();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLight = isMounted && resolvedTheme === 'light';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={t`Change theme`}
          aria-label={t`Change theme`}
          className="border-border bg-background text-foreground hover:bg-muted inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border transition-colors"
        >
          {isLight && <Sun className="size-4" />}
          {!isLight && <Moon className="size-4" />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={isMounted ? theme : undefined}
          onValueChange={setTheme}
        >
          <DropdownMenuRadioItem value="light" className="cursor-pointer">
            <Sun />
            {t`Light`}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="cursor-pointer">
            <Moon />
            {t`Dark`}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="cursor-pointer">
            <Monitor />
            {t`System`}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
