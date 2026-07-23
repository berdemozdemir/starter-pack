import { AuthenticatedPage } from '@/components/ui/layout/Authenticated';
import { ExampleDashboard } from './ExampleDashboard';

//  Module page shell — wire from a thin `app/**/page.tsx` when you need a route.
export function Page() {
  return (
    <AuthenticatedPage>
      <ExampleDashboard />
    </AuthenticatedPage>
  );
}
