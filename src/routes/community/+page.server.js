
export async function load({ fetch }) {
  let data;
  try {
    let res = await fetch("./community");
    let data = await res.json();
    console.log('data: ', data);
    return {
      community: data ?? [],
    };
  } catch (error) {
    console.log(error.message);
  }

  

}