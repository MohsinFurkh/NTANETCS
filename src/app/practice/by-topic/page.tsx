const topics = await prisma.$queryRaw<TopicStats[]>`
  WITH TopicStats AS (
    SELECT 
      topic,
      COUNT(*) as total_questions,
      (
        SELECT COUNT(DISTINCT qa.questionid)
        FROM questionattempt qa
        JOIN question q2 ON qa.questionid = q2.id
        WHERE q2.topic = q.topic
      ) as attempted_questions,
      ROUND(
        CAST(
          (
            SELECT COUNT(DISTINCT qa.questionid)
            FROM questionattempt qa
            JOIN question q2 ON qa.questionid = q2.id
            WHERE q2.topic = q.topic AND qa.iscorrect = true
          ) * 100.0 / 
          NULLIF(
            (
              SELECT COUNT(DISTINCT qa.questionid)
              FROM questionattempt qa
              JOIN question q2 ON qa.questionid = q2.id
              WHERE q2.topic = q.topic
            ), 0
          ) AS FLOAT
        ), 2
      ) as accuracy
    FROM question q
    GROUP BY topic
    ORDER BY topic ASC
  )
  SELECT 
    topic,
    total_questions,
    COALESCE(attempted_questions, 0) as attempted_questions,
    COALESCE(accuracy, 0) as accuracy
  FROM TopicStats;
`; 