import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass-dark group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-xl group-[.toaster]:rounded-full group-[.toaster]:px-6",
          description: "group-[.toast]:text-white/80",
          actionButton: "group-[.toast]:bg-white/20 group-[.toast]:text-white group-[.toast]:rounded-full",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white/80 group-[.toast]:rounded-full",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
