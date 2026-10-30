# Admin Search Console connection

The admin Analytics page can read Search Console clicks, impressions, CTR, average position, top pages, and queries after the server OAuth configuration is set and the admin authorizes a Google account that has access to the configured property.

## Google Cloud setup

1. Enable the Google Search Console API in a Google Cloud project.
2. Create a Web application OAuth client and add this exact production redirect URI to its authorized redirect URIs:
   `https://www.taishgaming.com/api/admin/search-console/callback`
3. Add the local URI too if you want local development:
   `http://localhost:3000/api/admin/search-console/callback`
4. Set up the OAuth consent screen for the site owner. The application requests only `webmasters.readonly`.
5. Confirm the Google account used during authorization has access to the Search Console property.

## Server environment

Set these as server-side deployment environment variables. Do not add the client secret or encryption key to `NEXT_PUBLIC_*` variables or commit them to the repository.

| Variable | Value |
| --- | --- |
| `GOOGLE_OAUTH_CLIENT_ID` | OAuth web client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | OAuth web client secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | Exact callback URI registered above |
| `GOOGLE_SEARCH_CONSOLE_PROPERTY` | Exact property identifier, such as `sc-domain:taishgaming.com` or `https://www.taishgaming.com/` |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | Base64 encoding of a randomly generated 32-byte key |

Generate the encryption key in PowerShell with:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

After setting the variables and deploying, sign in to `/admin/analytics` and select **Connect Search Console**. The refresh token is encrypted with AES-256-GCM before it is stored. The public site-settings reader filters that credential row, and site-settings saves reject integration credential keys.

Search Console data is processed with a delay. The dashboard ends its selected date range three days before the current date so partially processed days do not distort the displayed totals.
