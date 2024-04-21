
export async function load({ fetch }) {
  let data;
  try {
    let res = await fetch("./people");
    let data = await res.json();
    return {
      community: data ?? [],
    };
  } catch (error) {
    console.log(error.message);
  }

  

}