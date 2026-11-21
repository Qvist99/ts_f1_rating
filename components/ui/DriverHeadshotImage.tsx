import Image from "next/image";
import { User } from "lucide-react"

interface DriverHeadshotImageProps {
    headshotUrl: string | null;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}


export default function DriverHeadshotImage({ headshotUrl, alt, width = 75, height = 75, className = "" }: DriverHeadshotImageProps) {
    if (!headshotUrl) {
        return (
            <div
                className={`shrink-0 bg-[#3E4248] rounded-full flex items-center justify-center ${className}`}
                style={{ width, height }}
            >
                <User
                    className="text-[#8B949E]"
                    style={{ width: width / 2, height: height / 2 }}
                />
            </div>
        );
    }

    return (
        <Image src={headshotUrl} alt={alt} width={width} height={height} className={className} priority />
    );
}