import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

type Navlink = LinkProps & {
  children?: ReactNode;
  exact?: boolean;
  className?: string;
};

const NavLink = ({ children, exact, href, ...props }: Navlink) => {
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href.toString());

  if (isActive) {
    props.className = `active ${props.className || ''}`.trim();
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default NavLink;
