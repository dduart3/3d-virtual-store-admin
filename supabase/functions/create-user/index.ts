import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

interface CreateUserInput {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  role_id: number;
}

Deno.serve(async (req) => {
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allow all origins or specify your frontend URL
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Create a Supabase client with the Auth context of the logged in user
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'No autorizado, no hay un usuario autenticado' }), {
      status: 401,
      headers: corsHeaders,
    });
  }

  // Check if the user has admin role
  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('role_id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role_id !== 1) {
    return new Response(JSON.stringify({ error: 'Acceso denegado, se requiere rol de administrador' }), {
      status: 403,
      headers: corsHeaders,
    });
  }

  // Now we can use the service role key for admin operations
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    // Parse the request body
    const newUser: CreateUserInput = await req.json();

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: newUser.email,
      password: "123456", // Default password, should be changed by user
      email_confirm: true,
    });

    if (authError) {
      return new Response(JSON.stringify({ error: `Error creando usuario: ${authError.message}` }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Update profile with the provided user information
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        phone: newUser.phone,
        address: newUser.address,
        avatar_url: newUser.avatar_url,
        role_id: newUser.role_id,
      })
      .eq("id", authData.user.id);

    if (error) {
      // If profile update fails, delete the auth user to avoid orphaned records
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(JSON.stringify({ error: `Error actualizando perfil: ${error.message}` }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ userId: authData.user.id }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders,
    });
  }
});