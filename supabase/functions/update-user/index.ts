import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

interface UpdateUserInput {
  id: string;
  username: string;
  email: string;
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
    const userData: UpdateUserInput = await req.json();

    // Get the current user data to check if email has changed
    const { data: currentUser, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', userData.id)
      .single();

    if (fetchError) {
      return new Response(JSON.stringify({ error: `Error cargando el perfil del usuario: ${fetchError.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If email has changed, update it in auth
    if (currentUser.email !== userData.email) {
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        userData.id,
        { email: userData.email, email_confirm: true }
      );

      if (updateAuthError) {
        return new Response(JSON.stringify({ error: `Error actualizando el correo electrónico de autenticación: ${updateAuthError.message}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Update profile
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        address: userData.address,
        avatar_url: userData.avatar_url,
        role_id: userData.role_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: `Error actualizando el perfil: ${error.message}` }), {
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