import { loadUtil } from '$lib/apiUtils.js';

export async function load({ fetch, url }) {
  const todayUTC = formatDateUTC(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowUTC = formatDateUTC(tomorrow);
  const query = `./table/log?select=created_at,item!inner(id,name)&created_at=gte.${todayUTC}&created_at=lt.${tomorrowUTC}`;
  let data = []
  try {
    console.log('Habits Load')
    data = await loadUtil(fetch, query)
    // data = await loadUtil(fetch, './table/log?select=*') 
  } catch (error) {
    console.log(error.message)
  }
  return data;
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
