import { useSitePreviewContext } from "@/runtime/SitePreviewContext";

export function usePathname() {
  return useSitePreviewContext().pathname;
}

export function useRouter() {
  const { setPathname } = useSitePreviewContext();

  return {
    push: (pathname: string) => setPathname(pathname),
    replace: (pathname: string) => setPathname(pathname),
    back: () => undefined,
    forward: () => undefined,
    refresh: () => undefined,
    prefetch: async () => undefined,
  };
}
