export const environment = {
	production: true,
	cognito: {
		region: 'us-east-1',
		userPoolId: 'us-east-1_Z8w7iYiTa',
		clientId: '1f29bqp2uftofs1boitt279s15',
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
		url: 'https://hub.api.windingpath.club/v1/'
	}
};
