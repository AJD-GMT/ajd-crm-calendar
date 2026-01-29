import { apiSuccess, apiUnauthorized } from '@/lib/utils/api-response';
import { getCurrentUser } from '@/lib/utils/auth';

// GET /api/auth/me
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return apiUnauthorized();
    }

    return apiSuccess({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return apiUnauthorized();
  }
}
