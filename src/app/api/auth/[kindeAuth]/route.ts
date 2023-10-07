import { NextRequest } from "next/server";
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// params type any bc I won't use it, it's Kinde API code
export async function GET(request: NextRequest, { params }: any) {
  const endpoint = params.kindeAuth;
  return handleAuth(request, endpoint);
}
