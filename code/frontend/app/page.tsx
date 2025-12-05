import { MainAppWrapper } from '@/components/MainAppWrapper';

/**
 * Main Server Component Page.
 * It remains an RSC to utilize server-side data fetching (if necessary)
 * and to keep the initial page load minimal, but here it simply renders
 * the stateful client wrapper.
 */
export default async function Home() {
  // We no longer perform initial data fetching here, as the client hook
  // will handle user lists after WebSocket connection.
  return (
      <MainAppWrapper />
  );
}
