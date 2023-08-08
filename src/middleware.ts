import { Response, Request } from 'react-';
import { ServerGetToken } from '@clerk/types';

interface ClerkRequest extends Request {
  auth: {
    userId?: string | null;
    sessionId?: string | null;
    getToken: ServerGetToken;
  };
}

export default withEdgeMiddlewareAuth(async (req: ClerkRequest) => {
  const { userId, sessionId, getToken } = req.auth;

  const supabaseToken = await getToken({ template: 'supabase' });

  // Load any data your application needs for the API route

  return Response.next();
});
