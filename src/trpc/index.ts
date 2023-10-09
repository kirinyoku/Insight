import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    // check user for authorization
    if (!user?.id || !user?.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    // check if user is in database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // add user to database
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  test: publicProcedure.query(() => {
    return { message: "Hello World" };
  }),
});

export type AppRouter = typeof appRouter;
