import {
  AvatarCreator as RPMAvatarCreator,
  AvatarExportedEvent,
} from "@readyplayerme/react-avatar-creator";

interface AvatarCreatorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAvatarCreated: (avatarUrl: string) => void
}

export function AvatarCreator({ open, onOpenChange, onAvatarCreated }: AvatarCreatorProps) {
  if (!open) return null;

  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    console.log("Avatar exported event:", event);
    const url = event.data?.url;
    
    if (url) {
      onAvatarCreated(url);
    }
  };

  // Handle manual close (without creating avatar)
  const handleClose = () => {
    onOpenChange(false);
    
    // Reopen the create user dialog after a short delay
    setTimeout(() => {
      // We need to reopen the create user dialog without an avatar
      onAvatarCreated(""); // Pass empty string to trigger reopening without changing avatar
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full h-[90vh] max-w-5xl rounded-xl overflow-hidden border border-white/20 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="transition-all duration-200 hover:scale-125 hover:opacity-100 opacity-80 absolute top-4 right-4 z-20"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-lg hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        {/* Header with title */}
        <div className="absolute top-0 left-0 right-0 backdrop-blur-sm py-4 px-6 border-b border-white/10">
          <h2 className="text-white text-xl font-light tracking-wider">
            Crea tu avatar
          </h2>
        </div>

        {/* Avatar creator with better padding to account for our header */}
        <div className="w-full h-full pt-16">
          <RPMAvatarCreator
            subdomain="demo"
            onAvatarExported={handleOnAvatarExported}
            className="w-full h-full"
            config={{
              clearCache: true,
              bodyType: "fullbody",
              quickStart: false,
              language: "es",
            }}
          />
        </div>
      </div>
    </div>
  );
}
