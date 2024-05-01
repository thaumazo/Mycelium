// src/lib/apiUtils.js
import { error as kitError } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_URL } from '$env/static/public'

// ---------- !!!!!!!!!!!!! --------------
//DO NOT USE THIS KEY ANYWHERE EXCEPT FOR THIS FILE!!
//DO NOT ADD FUNCTIONS TO THIS FILE. IF NEEDED, CREATE A NEW ONE WITH A MORE SECURE DATABASE CONNECTION.
import { SECRET_SUPABASE_SERVICE_ROLL_KEY } from '$env/static/private'
// ---------- !!!!!!!!!!!!! --------------

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(PUBLIC_SUPABASE_URL, SECRET_SUPABASE_SERVICE_ROLL_KEY)

// Function to check if the API key is valid by querying the Supabase database. 
// This query bypasses RLS, and is only used in this file for checking valid API keys. 
// All other supabase calls should be made with the supabase object contained in locals 
export async function validateApiKey(apiKey) {
    const { data, error } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key', apiKey)
        .single();


    if (error || !data) {
        console.error('API Key validation error:', error?.message);
        return false;
    }
    return true;
}

// Middleware function to check API key
export async function checkApiKey(request, supabase) {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) return false; // No API key provided, continue checks for user context
    const isValid = await validateApiKey(apiKey);
    if (!isValid) {
        throw kitError(401, 'Invalid API Key');
    }
    return true; // API key is valid
}
