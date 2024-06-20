//<!-- +page.server.js -->
import { loadUtil, postUtil, fetchGeneratedTypes } from '$lib/apiUtils.js';

export async function load(event) {
  // Define searchParams as an object with default parameters
  let table = event.url.pathname.split('/').at(-1);

  let { query, format, additionalQueries } = await fetchGeneratedTypes(event.fetch, table);


  // console.log(query, format);

  let filter = {
    select: query // ex: id, name, profile!inner(id, name) 
    // Add additional query parameters as needed, e.g., eq: "id=value", "name=test"
  };

  // let types = await fetchGeneratedTypes(event.fetch);
  // console.log("types", types);

  // Call loadUtil with the modified event
  let { data, error } = await loadUtil(event, table, filter);

  let extraData = [];


  // Here I was trying to make additional queries to get the data for double referenced tables. The data can be fetched, but then it would have to be stitched back in with the existing above data - probably by matching keys.
  // For now, this is where I gave up and decided to focus on other problems.
  // for(let i = 0; i < additionalQueries.length; i++) {
  //   let {query, format: additionalFormat} = await fetchGeneratedTypes(event.fetch, additionalQueries[i].table);
  //   let filter = {
  //     select: query
  //   };

  //   format[additionalQueries[i].table] = additionalFormat;

  //   let { data: additionalData, error: additionalError } = await loadUtil(event, additionalQueries[i].table, filter);
  //   if (additionalError) {
  //     error = additionalError;
  //   } else {
  //     data[additionalQueries[i].table] = additionalData[0];
  //     // data[]
  //     extraData.push(additionalData[0]);
  //   }
  // }

  return { format, query, data, error, extraData, additionalQueries };
}