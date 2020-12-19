import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetQuestionsInput = Pick<
  Prisma.FindManyQuestionArgs,
  "where" | "orderBy" | "skip" | "take" | "cursor"
>

export default async function getQuestions(
  { where, orderBy, cursor, skip, take }: GetQuestionsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const questions = await db.question.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
    include: { choices: true },
  })

  const count = await db.question.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    questions,
    // nextPage,
    // hasMore,
    // count,
  }
}
