import { loadUtil } from '$lib/apiUtils.js';

export async function load({ fetch, url }) {
  const todayUTC = formatDateUTC(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowUTC = formatDateUTC(tomorrow);
  const completedQuery = `./table/log?select=created_at,item!inner(id,name)&created_at=gte.${todayUTC}&created_at=lt.${tomorrowUTC}`;
  const habitsQuery = `./table/items?select=*&tags=cs.{habit}&order=id.asc`;

  try {
    const [completed, habits] = await Promise.all([
      loadUtil(fetch, completedQuery),
      loadUtil(fetch, habitsQuery)
    ]);
    return { habits: {all: habits.data, completed: completed.data }};
  } catch (error) {
    console.error('Failed to load data:', error);
    return { habits: [], completed: [] }; // Provide fallback empty data
  }
}

function formatDateUTC(date) {
  const d = new Date(date);
  // Adjust date to UTC based on local timezone
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

// Generate today's date string adjusted for local timezone
