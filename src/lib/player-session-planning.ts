import type { PlayerSessionTask, PlayerWorkspace } from "./player-state";
export function sessionTaskDone(
  task: PlayerSessionTask,
  workspace: PlayerWorkspace,
): boolean {
  if (task.source === "goal")
    return (
      workspace.goals.find((item) => item.id === task.refId)?.completed ??
      task.done
    );
  if (
    task.source === "pin" &&
    workspace.personalMarkers.some((item) => item.id === task.refId)
  )
    return workspace.mapCompletedIds.includes(task.refId);
  if (task.source === "requirement")
    return workspace.tracker.completedIds.includes(task.refId);
  return task.done;
}
/** One explicit manual action updates the plan and its linked goal/map/checklist record. */
export function setSessionTaskDone(
  workspace: PlayerWorkspace,
  planId: string,
  taskId: string,
  done: boolean,
): PlayerWorkspace {
  const plan = workspace.sessionPlans.find((item) => item.id === planId);
  const task = plan?.tasks.find((item) => item.id === taskId);
  if (!plan || !task || plan.finishedAt) return workspace;
  const next = {
    ...workspace,
    sessionPlans: workspace.sessionPlans.map((item) =>
      item.id === planId
        ? {
            ...item,
            tasks: item.tasks.map((row) =>
              row.id === taskId ? { ...row, done } : row,
            ),
          }
        : item,
    ),
  };
  if (task.source === "goal")
    next.goals = workspace.goals.map((item) =>
      item.id === task.refId ? { ...item, completed: done } : item,
    );
  if (task.source === "pin")
    next.mapCompletedIds = done
      ? [...new Set([...workspace.mapCompletedIds, task.refId])]
      : workspace.mapCompletedIds.filter((id) => id !== task.refId);
  if (task.source === "requirement")
    next.tracker = {
      ...workspace.tracker,
      completedIds: done
        ? [...new Set([...workspace.tracker.completedIds, task.refId])]
        : workspace.tracker.completedIds.filter((id) => id !== task.refId),
      inProgressIds: (workspace.tracker.inProgressIds || []).filter(
        (id) => id !== task.refId,
      ),
      checkedAt: {
        ...workspace.tracker.checkedAt,
        ...(done ? { [task.refId]: new Date().toISOString() } : {}),
      },
    };
  return next;
}
