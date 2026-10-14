/** Share an image with a caption, falling back to sharing the caption, then to copying it. */
export async function shareImage(opts: { blob: Blob | null; fileName: string; title: string; text: string; url: string }) {
  const { blob, fileName, title, text, url } = opts;
  try {
    const file = blob && new File([blob], fileName, { type: "image/png" });
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title, text: `${text} ${url}` });
      return "shared" as const;
    }
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return "shared" as const;
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "copied" as const;
  } catch {
    return "cancelled" as const;
  }
}

export function saveImage(url: string, fileName: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

/** The app's address without the in-app route, for captions and cards. */
export const appUrl = () => window.location.href.split("#")[0];
