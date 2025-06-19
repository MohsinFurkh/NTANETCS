const question = await prisma.$queryRaw<{ id: string }[]>`
  WITH UnattemptedQuestions AS (
    SELECT q.id
    FROM question q
    LEFT JOIN questionattempt qa ON q.id = qa.questionid AND qa.userid = ${userId}
    WHERE qa.id IS NULL
  )
  SELECT id
  FROM UnattemptedQuestions
  ORDER BY RANDOM()
  LIMIT 1
`;

// If no unattempted questions, get any random question
if (!question || question.length === 0) {
  const anyQuestion = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM question
    ORDER BY RANDOM()
    LIMIT 1
  `;
  return anyQuestion[0]?.id;
} 