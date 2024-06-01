import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { SECRET_SUPABASE_ACCESS_TOKEN  } from '$env/static/private'


const execPromise = promisify(exec);

export const POST = async ({locals: { supabase } }) => {


  console.log('db-types POST')
  try {
    // Run the Supabase CLI command to generate types using the local installation
    const { stdout: login_stdout, stderr: login_stderr } = await execPromise(
      `npx supabase login --token ${SECRET_SUPABASE_ACCESS_TOKEN}`
    );
    const { stdout, stderr } = await execPromise(
      `npx supabase gen types typescript --project-id hodzdfzhsooveqnrsrdk`
    );

    if (stderr) {
      console.error('Error generating types:', stderr);
      return new Response(JSON.stringify({ error: 'Error generating types' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const typesFilePath = path.resolve('src/lib/database.types.ts');
    fs.writeFileSync(typesFilePath, stdout);
     // Read the file into a buffer
    const fileBuffer = fs.readFileSync(typesFilePath);


    const { data, error } = await supabase.storage
      .from('data_structures')
      .upload('database.types.ts', fileBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/typescript'
      });

    if(data) console.log('Uploaded types file:', data);

    if (error) {
      console.error('Error uploading types file:', error.message);
      return new Response(JSON.stringify({ error: 'Error uploading types file' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    

    return new Response(JSON.stringify({ message: 'Types generated successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: 'Error generating types' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};


export const GET = async ({locals: {supabase}}) => {
  try {
    const { data, error } = await supabase.storage
      .from('data_structures')
      .download('database.types.ts');

    if (error) {
      console.error('Error fetching types file:', error.message);
      return new Response(JSON.stringify({ error: 'Error fetching types file' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const typesContent = await data.text();
    const typesFilePath = path.resolve('src/lib/database.types.ts');
    fs.writeFileSync(typesFilePath, typesContent);

    return new Response(typesContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/typescript'
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: 'Error fetching types file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
