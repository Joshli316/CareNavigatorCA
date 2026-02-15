import type { Metadata } from 'next';
import { GrantProvider } from '@/lib/context/GrantContext';

export const metadata: Metadata = {
  title: 'Grant Navigator',
};

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return <GrantProvider>{children}</GrantProvider>;
}
