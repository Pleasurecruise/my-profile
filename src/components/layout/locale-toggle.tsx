import { Globe } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { SUPPORTED_LOCALES, getLocaleLabel } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  const cycle = () => {
    const idx = SUPPORTED_LOCALES.indexOf(locale);
    const next = SUPPORTED_LOCALES[(idx + 1) % SUPPORTED_LOCALES.length] as Locale;
    setLocale(next);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={cycle}
          aria-label={`Switch language (current: ${getLocaleLabel(locale)})`}
          className={cn("size-full rounded-full")}
        >
          <Globe className="size-1/2" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getLocaleLabel(locale)}</p>
      </TooltipContent>
    </Tooltip>
  );
}
