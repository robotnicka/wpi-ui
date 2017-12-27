// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  cognito: {
  	region: 'us-east-1',
    identityPoolId: 'us-east-1:803d4219-0925-424e-bb29-68a1b8afb3ef',
    userPoolId: 'us-east-1_EW8ym2TET',
    clientId: '5co7duouso70faqnca65q6hvu5',
    idp_endpoint: '',
    identity_endpoint: '',
    sts_endpoint: '',
  }
};
