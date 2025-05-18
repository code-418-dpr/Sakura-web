import siteMetadata from "@/conf/site-metadata";
import { Link } from "@heroui/react";

export default function FooterElement() {
    return (
        <footer className="border-foreground/15 w-full border-t px-4 py-6">
            <div className="text-default-700 mx-auto max-w-xl text-center">
                Разработано командой {<Link href={siteMetadata.authors.url}>{siteMetadata.authors.name}</Link>}
            </div>
        </footer>
    );
}
