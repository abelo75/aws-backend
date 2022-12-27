const TOKEN_NAME = 'Basic';
export const basicAuthorizer = async (event, context, callback) => {
  console.log('Event', JSON.stringify({ event, context }))
  const { type, authorizationToken} = event;
  if (type !== 'TOKEN' && !authorizationToken) {
    console.log('No token', JSON.stringify({type, authorizationToken}));
    callback('Unauthorized');
    return;
  }
  try {
    const [name, encoded] = authorizationToken.split(' ');
    if (name !== TOKEN_NAME || !encoded) {
      console.log('Token name invalid', JSON.stringify({ name, encoded }));
      callback('Unauthorized');
      return;
    }
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8').split(':');
    const [username, password] = decoded;
    const envPassword = process.env[username];
    console.log('Credentials', {username, password, envPassword});
    const grant = !envPassword || !password ? 'Deny' : 'Allow';
    const policy = generatePolicy(encoded, event?.methodArn, grant);
    callback(null, policy);
  } catch (e) {
    console.log('Error', JSON.stringify(e));
  }
}

const generatePolicy = (principalId, Resource, Effect = 'Allow') => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect,
          Resource,
        }
      ]
    }
  }
}
