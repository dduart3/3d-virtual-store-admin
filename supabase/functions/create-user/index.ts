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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create profile
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        ...newUser,
        id: authData.user.id,
      })
      .select()
      .single();

    if (error) {
      // If profile creation fails, delete the auth user to avoid orphaned records
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return new Response(JSON.stringify({ error: `Error creando perfil: ${error.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});