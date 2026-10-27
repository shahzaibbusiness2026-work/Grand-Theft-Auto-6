const safe = (n: number) =>
  Number.isFinite(n) ? Math.max(0, Math.min(n, 1e12)) : 0;
export const UNREACHABLE = "Not reachable";

export function savingsScenario(
  current: number,
  target: number,
  perMission: number,
  perHour: number,
  dailyHours: number,
  now = new Date(),
) {
  const goal = safe(target),
    cash = safe(current);
  const remaining = Math.max(0, goal - cash);
  const missionsNeeded =
    remaining === 0
      ? 0
      : safe(perMission) > 0
        ? Math.ceil(remaining / safe(perMission))
        : UNREACHABLE;
  const hours =
    remaining === 0 ? 0 : safe(perHour) > 0 ? remaining / safe(perHour) : null;
  const days =
    hours === 0
      ? 0
      : hours !== null && safe(dailyHours) > 0
        ? hours / Math.min(24, safe(dailyHours))
        : null;
  const date = new Date(now);
  if (days !== null) date.setDate(date.getDate() + Math.ceil(days));
  return {
    remaining,
    missionsNeeded,
    hoursNeeded: hours === null ? UNREACHABLE : Number(hours.toFixed(1)),
    daysNeeded: days === null ? UNREACHABLE : Number(days.toFixed(1)),
    completionDateStr:
      days === null
        ? UNREACHABLE
        : Number.isFinite(date.getTime())
          ? date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Beyond calendar range",
    progressPct:
      goal === 0 ? 100 : Math.min(100, Math.round((cash / goal) * 100)),
  };
}

export function businessScenario(b: {
  purchasePrice: number;
  upgradeCost: number;
  grossRevenuePerHour: number;
  operatingCostPerHour: number;
  hoursPerDay: number;
}) {
  const totalInvestment = safe(b.purchasePrice) + safe(b.upgradeCost);
  const netProfitPerHour =
    safe(b.grossRevenuePerHour) - safe(b.operatingCostPerHour);
  const netProfitPerDay = netProfitPerHour * Math.min(24, safe(b.hoursPerDay));
  return {
    totalInvestment,
    netProfitPerHour,
    netProfitPerDay,
    netProfitPerWeek: netProfitPerDay * 7,
    breakEvenHours:
      totalInvestment === 0
        ? 0
        : netProfitPerHour > 0
          ? Number((totalInvestment / netProfitPerHour).toFixed(1))
          : UNREACHABLE,
    breakEvenDays:
      totalInvestment === 0
        ? 0
        : netProfitPerDay > 0
          ? Number((totalInvestment / netProfitPerDay).toFixed(1))
          : UNREACHABLE,
    annualRoiPct:
      totalInvestment > 0
        ? Number((((netProfitPerDay * 365) / totalInvestment) * 100).toFixed(1))
        : null,
  };
}
