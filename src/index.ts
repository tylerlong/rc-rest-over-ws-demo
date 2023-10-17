import RingCentral from '@rc-ex/core';
import WsExtension from '@rc-ex/ws';
import DebugExtension from '@rc-ex/debug';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  const debugExt = new DebugExtension();
  await rc.installExtension(debugExt);
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });
  const wsExt = new WsExtension({
    debugMode: true,
    restOverWebSocket: true,
  });
  await rc.installExtension(wsExt);
  await rc.restapi().dictionary().country('46').get();
  wsExt.options.restOverWebSocket = false;
  await rc.restapi().dictionary().country('46').get();
  await rc.restapi(null).oauth().revoke().post({
    token: rc.token!.access_token!,
  });
  wsExt.options.restOverWebSocket = true;
  await rc.restapi().dictionary().country('46').get();
  await rc.revoke();
};
main();
