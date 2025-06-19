  // Progress by subject
  prisma.$queryRaw<SubjectProgress[]>`
    WITH SubjectCounts AS (
      SELECT 
        subject,
        CAST(COUNT(*) AS INTEGER) as total
      FROM question
      GROUP BY subject
    ),
    UserAttempts AS (
      SELECT 
        q.subject,
        CAST(COUNT(*) AS INTEGER) as attempted,
        ROUND(CAST(AVG(CASE WHEN qa.iscorrect THEN 100.0 ELSE 0 END) AS FLOAT), 2) as accuracy
      FROM question q
      JOIN questionattempt qa ON q.id = qa.questionid
      WHERE qa.userid = ${user.id}
      GROUP BY q.subject
    )
    SELECT 
      sc.subject,
      sc.total as totalQuestions,
      COALESCE(CAST(ua.attempted AS INTEGER), 0) as attempted,
      COALESCE(CAST(ua.accuracy AS FLOAT), 0) as accuracy
    FROM SubjectCounts sc
    LEFT JOIN UserAttempts ua ON sc.subject = ua.subject
    ORDER BY sc.subject
  `, 