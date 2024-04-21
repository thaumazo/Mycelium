<script>
	import { Auth } from "@supabase/auth-ui-svelte";
    import { ThemeSupa } from '@supabase/auth-ui-shared';

    
    export let data;
	console.log(data.session);
</script>

<Auth
	supabaseClient={data.supabase}
	view="sign_in"
	redirectTo={`./callback`}
	showLinks={true}
	providers={["google"]}
	appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
/>