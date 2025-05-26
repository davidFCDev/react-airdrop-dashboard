import { Link } from "@heroui/link";

import { siteConfig } from "@/config/site";

const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-center py-3 bg-default-100 border-t border-default-200">
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href={siteConfig.links.github}
        title="Github User"
      >
        <span className="text-default-600">Powered by</span>
        <p className="text-primary">Chucky</p>
      </Link>
    </footer>
  );
};

export default Footer;
