import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from '@/i18n/settings';
import { supabaseService } from './supabaseService';

acceptLanguage.languages(languages);

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (request.nextUrl.pathname.startsWith('/api')) {
    return supabaseResponse;
  }

  if (user) {
    const responseUser = await supabaseService
      .from('users')
      .select('is_verified')
      .eq('id', user?.id)
      .single();

    const discordProvider = user?.identities?.find(
      (identity) => identity.provider === 'discord',
    );
    if (discordProvider && !responseUser.data?.is_verified) {
      await supabaseService
        .from('users')
        .update({ is_verified: true, discord_id: discordProvider.id })
        .eq('id', user?.id);
    }
  }

  let lng;
  if (request.cookies.has(cookieName))
    lng = (request.cookies.get(cookieName) || {}).value;
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  if (
    user &&
    request.nextUrl.pathname.includes(`/auth`) &&
    !['finalize', 'error'].some((path) =>
      request.nextUrl.pathname.includes(`/auth/${path}`),
    )
  ) {
    return NextResponse.redirect(`${request.nextUrl.origin}/${lng}`);
  }

  if (!user && !request.nextUrl.pathname.includes(`/auth`)) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    const queryParamString = new URLSearchParams({
      type: 'login',
    }).toString();

    return NextResponse.redirect(
      `${url.origin}/${lng}/auth?${queryParamString}`,
    );
  }

  if (
    !languages.some((loc: string) =>
      request.nextUrl.pathname.startsWith(`/${loc}`),
    ) &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    const query = request.nextUrl.searchParams;
    let pathname = `/${lng}${request.nextUrl.pathname}`;
    if (query.toString()) pathname += `?${query.toString()}`;

    return NextResponse.redirect(new URL(pathname, request.url));
  }

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') as string);
    const lngInReferer = languages.find((l: string) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    if (lngInReferer) supabaseResponse.cookies.set(cookieName, lngInReferer);
    return supabaseResponse;
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
