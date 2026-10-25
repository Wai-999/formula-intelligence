// Every assessable item in a lesson body that practice may draw on, in the
// order the lesson shows them: practice, the "Use it" task, the checkpoint.
// (Prior-knowledge checks are excluded: they test the previous lesson.)
export const lessonItems = (body) => [...body.practice, ...(body.apply?.items ?? []), ...body.checkpoint];
