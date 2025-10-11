import IsletmeLayoutClient from './IsletmeLayoutClient';

export default function IsletmeLayout({ children }: { children: React.ReactNode }) {
  return <IsletmeLayoutClient>{children}</IsletmeLayoutClient>;
}