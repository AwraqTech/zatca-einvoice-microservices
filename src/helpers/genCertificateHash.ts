import { createHash } from "crypto";

interface CertificateHashProps {
    certificateString: string;
}

export default function genCertificateHash({ certificateString }: CertificateHashProps): string {
    try {
        const certificateBuffer = Buffer.from(
            createHash("sha256").update(certificateString).digest("hex")
        ).toString("base64");
        return certificateBuffer;

    } catch (error: any) {
        throw new Error(`Failed to extract certificate info: ${error.message}`);
    }
}
