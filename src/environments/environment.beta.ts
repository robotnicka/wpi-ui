// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: true,
	cognito: {
		region: 'us-east-1',
		userPoolId: 'us-east-1_EW8ym2TET',
		clientId: '7jb1m6g5em511a0f61ji84s0dq',
		idp_endpoint: '',
		identity_endpoint: '',
		sts_endpoint: '',
		setCookie: true,
		cookieDomain: 'windingpath.club',
		cookieSecure: true
	},
	auth0: {
		domain: 'wpidev.auth0.com',
		clientId: 'TgFNmfJKLYJcSPCFQCsN42UHejfJoy1i',
		audience: "https://dev.joeterranova.net/api/hub/",
		managementAudience: "https://wpidev.auth0.com/api/v2/",
		metadataKey: "https://dev.joeterranova.netuser_metadata",
		dbConnection: "Username-Password-Authentication"
	},
	hub: {
		url: 'https://hubbeta.api.windingpath.club/v1/'
	}
};
