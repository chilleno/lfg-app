import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'

const handler = async (req: NextRequest) => {
    const cookieStore = cookies()
    const code = req.nextUrl.searchParams.get('code') as string;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const CLIENT_ID = process.env.CLIENT_ID;
    const TOKEN_ENDPOINT = process.env.TOKEN_ENDPOINT as string;
    const redirectUri = process.env.REDIRECT_URL as string;
    const scopes = process.env.SCOPES as string;

    // build headers
    const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const headers = {
        authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    // build request body
    const params = new URLSearchParams();
    params.append('redirect_uri', redirectUri);
    params.append('scope', scopes);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);

    // execute request
    const requestOptions = {
        method: 'POST',
        body: params,
        headers
    };

    const oauthResponse = await fetch(TOKEN_ENDPOINT, requestOptions);

    // handle errors
    if (!oauthResponse.ok) { // res.status >= 200 && res.status < 300
        console.log(`Token request failed with "${oauthResponse.statusText}"`);
        return NextResponse.error();
    }

    // work with the oauth response
    const responseData = await oauthResponse.json();

    cookies().set('access_token', responseData.access_token)
    cookies().set('token_type', responseData.token_type)
    cookies().set('expires_in', responseData.expires_in)
    cookies().set('scope', responseData.scope)

    // send a JSON response (just an example)
    return new NextResponse(JSON.stringify(responseData));
}

export { handler as GET }