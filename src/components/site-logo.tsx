import Image from "next/image";

type SiteLogoProps = {
  city?: string;
  context?: string;
};

export function SiteLogo({ city, context }: SiteLogoProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative h-12 w-12 shrink-0">
        <Image
          alt="Islamcars"
          className="object-contain"
          fill
          priority
          sizes="48px"
          src="/islamcars-logo.svg"
        />
      </span>
      <span>
        <span className="block text-xl font-black leading-tight text-[#3a444b]">
          Islamcars
        </span>
        {context ?? city ? (
          <span className="block text-sm text-[#6b7280]">
            {context ?? city}
          </span>
        ) : null}
      </span>
    </span>
  );
}
